import { TypescriptParser } from 'typescript-parser';
const fs = require('fs');
import { JSDocExplanation } from './src/types/types';

function annotate(jsonSchemaObject: any, jsDocComments: any): any {
  console.log(jsonSchemaObject.name);
  let match = jsDocComments.find(e => e.name === jsonSchemaObject.name);
  if (match) {
    jsonSchemaObject.description = match.description;
    jsonSchemaObject.returns = match.returns;
    jsonSchemaObject.paramExplanation = match.params;
  }
  return jsonSchemaObject;
}

/**
 * Get JS Documentation from JS Documentation
 */

const jsdoc = require('jsdoc-api');

let file = fs.readFileSync('./dev/MediaPlayer.js');

let explain = jsdoc.explainSync({ source: file.toString() }) as JSDocExplanation[];
let allprops = explain;
explain.forEach(e => {
  if (e.properties) {
    allprops = allprops.concat(e.properties);
  }
});
let jsDocComments = allprops.filter(a => !a.undocumented);
fs.writeFileSync('./dev/explain.json', JSON.stringify(jsDocComments, null, 2));
// console.log(jsDocComments);

/**
 * Parse the Typescript file (index.d.ts)
 */
const parser = new TypescriptParser();

// either:
// const parsed = await parser.parseSource(/* typescript source code as string */);

// or a filepath
const parsed = parser.parseFile('./dev/index.d.ts', './').then(parsed => {
  let functions = parsed.resources[0].declarations.filter(d => d.name === 'MediaPlayerClass')[0].methods.filter(f => f.name != 'on');
  let annotated = [];
  functions.forEach(element => {
    annotated.push(annotate(element, jsDocComments));
  });
  console.log(annotated);
  fs.writeFileSync('./dev/mediaPlayerFunctionsMetaData.json', JSON.stringify(functions, null, 2));
  fs.writeFileSync('./src/static/mediaPlayerFunctionsMetaData.json', JSON.stringify(functions, null, 2));
  // fs.writeFileSync('./dev/ast.json', JSON.stringify(parsed.resources, null, 2));
});

console.log(parsed);
