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
let onlyFirst = true;

let first = true;

async function main() {
  await downloadSourceFiles({
    outputFolder: workingFolder,
    github_token: process.env.GITHUB_TOKEN,
  });

  // TODO: Await finihes before all requests are finished.

  fs.readdirSync(workingFolder)
    .reverse()
    .forEach(version => {
      if (first == true) {
        if (onlyFirst == true) first = false;
        // For each version
        const workFolder = `${workingFolder}/${version}/`;
        const overwriteFolder = `${overwritingFolder}/${version}/`;

        generateAPIMetaData(workingFolder, version);
        generateSettingsMetaData(workingFolder, version);
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
}

main();
