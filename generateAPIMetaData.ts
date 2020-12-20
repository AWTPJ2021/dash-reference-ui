import { TypescriptParser } from 'typescript-parser';
const fs = require('fs');

const parser = new TypescriptParser();

// either:
// const parsed = await parser.parseSource(/* typescript source code as string */);

// or a filepath
const parsed = parser.parseFile('./dev/index.d.ts', './').then(parsed => {
  let functions = parsed.resources[0].declarations.filter(d => d.name === 'MediaPlayerClass')[0].methods.filter(f => f.name != 'on');

  console.log(functions);
  fs.writeFileSync('./dev/mediaPlayerFunctionsMetaData.json', JSON.stringify(functions, null, 2));
  fs.writeFileSync('./src/static/mediaPlayerFunctionsMetaData.json', JSON.stringify(functions, null, 2));
  // fs.writeFileSync('./dev/ast.json', JSON.stringify(parsed.resources, null, 2));
});

console.log(parsed);
