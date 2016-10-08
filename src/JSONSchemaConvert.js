'use strict';

const logger = require('./logger'),
    _ = require('lodash');

const VALUE_TYPE_MAPPING = {
    boolean: 'boolean',
    integer: 'number',
    number: 'number',
    string: 'string'

};

class JSONSchemaConvert {

    generateModel(schema, title) {
        return this.handleObject(schema, title);
    }

    handleObject(schema, title) {
        var modelType = this.capitalizePropName(title);
        var properties = schema.properties;
        var requiredFields = schema.required || [];
        var objectModels = _.chain(properties).map((value, name)=> {
            return {
                name: name,
                value,
                modelType
            };
        }).reduce((models, item) => {
            let typeWithModels = this.parseHandler(item.value, item.name);
            var model = {
                name: item.name,
                importType: typeWithModels.importType,
                type: typeWithModels.type,
                enum: typeWithModels.enum,
                required: requiredFields.indexOf(item.name) !== -1,
                default: item.value.default
            };
            models[item.modelType] = models[item.modelType] || [];
            models[item.modelType].push(model);
            if (typeWithModels.models) {
                Object.assign(models, typeWithModels.models);
            }
            return models;
        }, {}).value();

        return {type: modelType, importType: modelType, models: objectModels};
    }

    parseHandler(desc, name) {
        var typeMethodName = `handle${_.capitalize(desc.type)}`;
        var typeMethodRef = this[typeMethodName] || this.handleOthers;
        return typeMethodRef.call(this, desc, name);
    }

    handleArray(desc, name) {
        let typeWithModels = this.parseHandler(desc.items, name);
        return Object.assign({}, {type: `${typeWithModels.type}[]`}, {
            models: typeWithModels.models,
            importType: typeWithModels.importType
        });
    }

    handleOthers(desc) {
        return {type: VALUE_TYPE_MAPPING[desc.type] || 'any', enum: desc.enum};
    }

    capitalizePropName(name) {
        var camelCase = _.camelCase(name);
        return camelCase.substr(0, 1).toUpperCase() + camelCase.substr(1);
    }
}

module.exports = new JSONSchemaConvert();