'use strict';

const program = require('commander'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    tsModelConvertFactory = require('./src/TSModelGenerateFactory'),
    pkg = require('./package.json');

program
    .version(pkg.version)
    .usage('[options] <input ...>')
    .option('-f, --input <n>', 'source file of input')
    .option('-o, --output <n>', 'output directory')
    .option('-c, --class', 'generate typescript class')
    .option('-j, --json', 'generate typescript model from json file. default is from json schema')
    .description('Generate typescript model from json schema.')
    .parse(process.argv);


let typeModel = program.class ? 'class' : 'interface';
let inputPath = resolvePath(program.input);
let files = [inputPath];
let outputPath = resolvePath(program.output) || inputDirectory;


if (fs.lstatSync(inputPath).isDirectory()) {
    files = fs.readdirSync(inputPath).map(item => path.join(inputPath, item));
    outputPath = resolvePath(program.output) || inputPath;
}


let submitPromise = _.chain(files).map(item => {
    return tsModelConvertFactory.generateModel({
        input: item,
        output: outputPath,
        typeModel: typeModel,
        json: program.json
    });
}).value();

Promise.all(submitPromise).then(function () {
    // All done
});

function resolvePath(file) {
    if (file) {
        return path.isAbsolute(file) ? file : path.join(__dirname, file);
    }
}

function resolveDirectory(file) {
    if (file) {
        return path.dirname(file);
    }
}