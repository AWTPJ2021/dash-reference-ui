import { resolve } from 'path';
import * as TJS from 'typescript-json-schema';
const fs = require('fs');

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
  // console.log(ast);
  return ast;
}

function annotate(jsonSchemaObject: any, jsDocComments: any, name: string): any {
  if (jsonSchemaObject.properties) {
    Object.keys(jsonSchemaObject.properties).forEach(o => {
      annotate(jsonSchemaObject.properties[o], jsDocComments, o);
      // console.log(o);
    });
  }
  let match = jsDocComments.find(e => e.name === name);
  if (match) {
    // console.log(name);
    // console.log(match);
    jsonSchemaObject.description = match.description;
    jsonSchemaObject.required = !match.optional;
    jsonSchemaObject.example = match.defaultvalue;
  }
  return jsonSchemaObject;
}

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

// ... or a generator that lets us incrementally get more schemas

const generator = TJS.buildGenerator(program, settings);
const schema = generator.getSchemaForSymbol('dashjs.MediaPlayerSettingClass');
const apiSchema = generator.getSchemaForSymbol('dashjs.MediaPlayerClass');

console.log(apiSchema);
// debug for symbols
// const symbols = generator.getUserSymbols();
// console.log(symbols);

import { JSDocExplanation, Setting, Type } from './src/types/types';
const jsdoc = require('jsdoc-api');

let file = fs.readFileSync('./dev/settings.js');

let explain = jsdoc.explainSync({ source: file.toString() }) as JSDocExplanation[];
fs.writeFileSync('./dev/explain.json', JSON.stringify(explain, null, 2));

let allprops = explain;
explain.forEach(e => {
  if (e.properties) {
    allprops = allprops.concat(e.properties);
  }
});
let jsDocComments = allprops.filter(a => !a.undocumented);

// tree to ast
let ast = treeToAST(annotate(schema, jsDocComments, 'Settings'), 'settings', null);

fs.writeFileSync('./dev/out.json', JSON.stringify(ast, null, 2));
