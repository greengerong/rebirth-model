'use strict';
const fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    logger = require('./logger');

const MODEL_TEMPLATE = _.chain(['interface', 'class']).reduce((obj, item) => {
    obj[item] = fs.readFileSync(path.join(__dirname, `./template/model-template.${item}.tpl`));
    return obj;
}, {}).value();

class TSModelGenerator {

    generate(modelTypes, options) {
        let tpls = _.chain(modelTypes.models).map((type, name)=> {
            return {
                name: name,
                content: this.generateType({type, name, typeModel: options.typeModel})
            }
        }).value();

        return tpls;
    }

    generateType(options) {
        const typeModel = options.typeModel || 'interface';
        return _.template(MODEL_TEMPLATE[typeModel])(options);
    }

}

module.exports = new TSModelGenerator();