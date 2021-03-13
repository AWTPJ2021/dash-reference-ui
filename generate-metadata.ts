import { downloadSourceFiles } from './metadata/get-source-files';
import { generateSettingsMetaData } from './metadata/generateSettingsMetaData';
import { generateAPIMetaData } from './metadata/generateAPIMetaData';
import { mergeFiles } from './metadata/merge-files';
import * as fs from 'fs';

// Read .env Files in the same folder
require('dotenv').config();

const workingFolder = './metadata/build';
const overwritingFolder = './metadata/overwrites';
const outputFolder = './src/static/gen/';

/**
 * Switch on or off for generation of all files or only the current version
 */
let onlyFirst = process.env.ONLY_FIRST === undefined ? true : process.env.ONLY_FIRST == '1';

let first = true;

async function main() {
  downloadSourceFiles({
    outputFolder: workingFolder,
    github_token: process.env.GITHUB_TOKEN,
  }).then(async () => {
    let versions = fs.readdirSync(workingFolder).reverse();
    versions.forEach(async version => {
      if (first == true) {
        if (onlyFirst == true) {
          first = false;
          console.log("ATTENTION: Only the latest version will be generated. Set 'ONLY_FIRST=0' to generate all versions.");
        }
        // For each version
        const workFolder = `${workingFolder}/${version}/`;
        const overwriteFolder = `${overwritingFolder}/${version}/`;

        await generateAPIMetaData(workingFolder, version);
        await generateSettingsMetaData(workingFolder, version);
        if (!fs.existsSync(outputFolder)) {
          fs.mkdirSync(outputFolder, { recursive: true });
        }
        mergeFiles(`${workFolder}settingsMetaData.json`, `${overwriteFolder}settingsMetaData.json`, `${outputFolder}settingsMetaData-${version}.json`);
        mergeFiles(
          `${workFolder}mediaPlayerFunctionsMetaData.json`,
          `${overwriteFolder}mediaPlayerFunctionsMetaData.json`,
          `${outputFolder}mediaPlayerFunctionsMetaData-${version}.json`,
        );
      }
    });

    fs.writeFileSync(`${outputFolder}/versions.json`, JSON.stringify(versions));
  });
}

main();
