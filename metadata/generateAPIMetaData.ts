import { TypescriptParser } from 'typescript-parser';
const fs = require('fs');
const jsdoc = require('jsdoc-api');

export async function generateAPIMetaData(baseDir: string = './metadata/build', version: string) {
  console.info(`Generating API MetaData for ${version}`);
  try {
    const workFolder = `${baseDir}/${version}/`;
    /**
     * Get JS Documentation
     */
    let file = fs.readFileSync(`${workFolder}MediaPlayer.js`);

    let explain = jsdoc.explainSync({ source: file.toString() }) as any[];
    let allprops = explain;
    explain.forEach(e => {
      if (e.properties) {
        allprops = allprops.concat(e.properties);
      }
    });
    let jsDocComments = allprops.filter(a => !a.undocumented);

    /**
     * Parse the Typescript file (index.d.ts)
     */
    const parser = new TypescriptParser();
    const parsed = await parser.parseFile(`${workFolder}index.d.ts`, './');

    let functions = (parsed.resources[0].declarations.filter(d => d.name === 'MediaPlayerClass')[0] as any).methods.filter(f => f.name != 'on');
    let annotated = [];
    functions.forEach(element => {
      annotated.push(annotate(element, jsDocComments));
    });
    fs.writeFileSync(`${workFolder}mediaPlayerFunctionsMetaData.json`, JSON.stringify(functions, null, 2));
  } catch (error) {
    console.warn(`WARNING: APIMetaData for ${version} could not be parsed!`);
  }
  return;
}

function annotate(jsonSchemaObject: any, jsDocComments: any): any {
  let match = jsDocComments.find(e => e.name === jsonSchemaObject.name);
  if (match) {
    jsonSchemaObject.description = match.description;
    jsonSchemaObject.returns = match.returns;
    jsonSchemaObject.paramExplanation = match.params;
  }
  return jsonSchemaObject;
}
