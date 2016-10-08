'use strict';
const path = require('path');

const jsonSchemaConvert = require('./JSONSchemaConvert'),
    tsModelGenerator = require('./TSModelGenerator'),
    fs = require('fs'),
    _ = require('lodash'),
    logger = require('./logger'),
    GenerateSchema = require('generate-schema');

class TSModelGenerateFactory {

    generateModel(options) {
        logger.info({data: options}, `Convert [%s] start...`, options.input);
        let rootModel = this.getRootModel(options.input);
        let schema = this.getJSONSchema(options, rootModel);
        var modelTypes = jsonSchemaConvert.generateModel(schema, rootModel);
        logger.info({data: modelTypes}, `Get model type tree.`);
        var types = tsModelGenerator.generate(modelTypes, {typeModel: options.typeModel});

        var promises = _.chain(types).map((item) => this.writeTo(item, options.output)).value();
        return Promise.all(promises)
            .then(function () {
                logger.info(`Generate all typescript model to ${options.output} success!`);
            }, function (reason) {
                logger.error(`Generate typescript model error: ${reason}.`);
            });
    }

    getJSONSchema(options, title) {
        let schema = JSON.parse(fs.readFileSync(options.input));
        if (options.json) {
            schema = GenerateSchema.json(title, schema);
            logger.info({data: schema}, `Get json schema from json.`);
        }
        return schema;
    }

    writeTo(models, output) {
        return new Promise((resolve, reject) => {
            var filePath = path.join(output, `${models.name}.ts`);
            fs.writeFile(filePath, models.content, (error)=> {
                if (error) {
                    return reject(error);
                }

                return resolve(`Write ${models.name} to ${filePath} success!`);
            })
        });
    }

    getRootModel(filePath) {
        var file = path.parse(filePath);
        return file.name.replace(/\W/g, "_");
    }
}

module.exports = new TSModelGenerateFactory();