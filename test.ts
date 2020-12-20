import { resolve } from 'path';
const fs = require('fs');

import * as TJS from 'typescript-json-schema';

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
};

// optionally pass a base path
const basePath = './dev/';

const program = TJS.getProgramFromFiles([resolve('./dev/index.d.ts')], compilerOptions, basePath);

const schema = TJS.generateSchema(program, 'dashjs.MediaPlayerSettingClass', settings);

// ... or a generator that lets us incrementally get more schemas

// const generator = TJS.buildGenerator(program, settings);

// all symbols
// const symbols = generator.getUserSymbols();

// Get symbols for different types from generator.
// console.log(symbols);
// console.log(generator.getSchemaForSymbol('dashjs.MediaPlayerSettingClass'));

import { JSDocExplanation, Setting, Type } from './src/types/types';
const jsdoc = require('jsdoc-api');

let file = fs.readFileSync('./dev/settings.js');

let explain = jsdoc.explainSync({ source: file.toString() }) as JSDocExplanation[];
fs.writeFileSync('./dev/explain.json', JSON.stringify(explain, null, 2));

console.log(explain.length);
let allprops = explain;
explain.forEach(e => {
  if (e.properties) {
    allprops = allprops.concat(e.properties);
  }
});
console.log(allprops.length);
allprops = allprops.filter(a => !a.undocumented);
console.log(allprops.length);

// tree to ast
let ast = treeToAST(annotate(schema, 'Settings'), 'settings', null);

fs.writeFileSync('./dev/out.json', JSON.stringify(ast, null, 2));

function treeToAST(tree: any, name: string, parent: string, path: string[] = []) {
  let ast = [];
  let id = path.join('.') + '.' + name;
  if (tree.properties) {
    path = [...path, name];
    Object.keys(tree.properties).forEach(o => {
      ast = ast.concat(treeToAST(tree.properties[o], o, name, path));
    });
  } else {
    ast = ast.concat({ ...tree, id, path, name, parent });
  }
  console.log(ast);
  return ast;
}

function annotate(jsonSchemaObject: any, name: string): any {
  if (jsonSchemaObject.properties) {
    Object.keys(jsonSchemaObject.properties).forEach(o => {
      annotate(jsonSchemaObject.properties[o], o);
      // console.log(o);
    });
  }
  let match = allprops.find(e => e.name === name);
  if (match) {
    // console.log(name);
    // console.log(match);
    jsonSchemaObject.description = match.description;
    jsonSchemaObject.required = !match.optional;
    jsonSchemaObject.example = match.defaultvalue;
  }
  return jsonSchemaObject;
}

// Quicktype Solution
// const { quicktype, InputData, schemaFor } = require('quicktype-core');
// const fs = require('fs');

// async function quicktypeFile() {
//   let file = fs.readFileSync('./dev/settings.js').toString();

//   // We could add multiple schemas for multiple types,
//   // but here we're just making one type from JSON schema.

//   const inputData = new InputData();
//   inputData.addInput('typescript', file);

//   return await quicktype({
//     file,
//     lang: 'json-schema',
//   });
// }

// console.log(quicktypeFile());
