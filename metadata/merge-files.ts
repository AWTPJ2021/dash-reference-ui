import * as fs from 'fs';

export async function mergeFiles(pathToFileA: string, pathToFileB: string, out: string) {
  if (fs.existsSync(pathToFileA)) {
    let fileA = JSON.parse(fs.readFileSync(pathToFileA).toString()) as any[];
    let merge = fileA;
    if (fs.existsSync(pathToFileB)) {
      let fileB = JSON.parse(fs.readFileSync(pathToFileB).toString()) as any[];

      merge = fileA.map(elOfA => ({ ...elOfA, ...fileB.find(elOfB => elOfB.id === elOfA.id) }));

      fileB.forEach(elOfB => {
        let found = fileA.find(elOfA => elOfA.id === elOfB.id);
        if (!found) {
          // TODO: Should check if the element is correct!
          merge.push(elOfB);
        }
      });
      console.info(`Found Overwrite file in ${pathToFileB}. Did Overwrite!`);
    }

    fs.writeFileSync(out, JSON.stringify(merge, null, 2));
  } else {
    console.warn(`WARNING: Could not generate ${out}`);
  }
}
