import { resolve } from 'path';
import * as TJS from 'typescript-json-schema';
const fs = require('fs');

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true,
};

export async function generateSettingsMetaData(baseDir: string = './metadata/build', version: string) {
  console.info(`Generating API MetaData for ${version}`);
  const workFolder = `${baseDir}/${version}/`;

  try {
    const program = TJS.getProgramFromFiles([resolve(`${workFolder}index.d.ts`)], compilerOptions, baseDir);

    // ... or a generator that lets us incrementally get more schemas

    const generator = TJS.buildGenerator(program, settings);
    const schema = generator.getSchemaForSymbol('dashjs.MediaPlayerSettingClass');

    // debug for symbols
    // const symbols = generator.getUserSymbols();
    // console.log(symbols);

    const jsdoc = require('jsdoc-api');

    let file = fs.readFileSync(`${workFolder}settings.js`);

    let explain = jsdoc.explainSync({ source: file.toString() }) as any[];
    // fs.writeFileSync(`${workFolder}explain-settings.json`, JSON.stringify(explain, null, 2));

    let allprops = explain;
    explain.forEach(e => {
      if (e.properties) {
        allprops = allprops.concat(e.properties);
      }
    });
    let jsDocComments = allprops.filter(a => !a.undocumented);

    // tree to ast
    let ast = treeToAST(annotate(schema, jsDocComments, 'Settings'), 'settings', null);

    fs.writeFileSync(`${workFolder}settingsMetaData.json`, JSON.stringify(ast, null, 2));
    // fs.writeFileSync('./src/static/settingsMetaData.json', JSON.stringify(ast, null, 2));
  } catch (error) {
    console.warn(`WARNING: SettingsMetaData for ${version} could not be parsed!`);
    // console.warn(error)
  }
}

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
