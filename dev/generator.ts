import { JSDocExplanation, Setting, Type } from '../src/types/types';
const jsdoc = require('jsdoc-api');
const fs = require('fs');

let file = fs.readFileSync('./settings.js');

let explain = jsdoc.explainSync({ source: file.toString() }) as JSDocExplanation[];

let settings: Setting[] = [];
console.log(explain.length);
explain.forEach(elm => {
  settings = findNodeForElement(elm, settings);
});

// let members = [];
// console.log(explain)
// let settings = explain.reduce((p, elm) => {
//   if (elm.kind == 'module') {
//     members.push(elm.longname);
//     p[elm.longname] = elm;
//   }
//   if (members.includes(elm.memberof)) {
//     if (p[elm.memberof]['child'] == undefined) {
//       p[elm.memberof]['child'] = [elm];
//     } else {
//       p[elm.memberof]['child'].push(elm);
//     }
//   }
//   return p;
// }, {});
console.log(settings);

fs.writeFileSync('./out.json', JSON.stringify(settings, null, 2));

function findNodeForElement(element: JSDocExplanation, tree: Setting[]) {
  if (element.undocumented) {
    return tree;
  }
  tree.forEach(t => {
    // console.log(t);
    if (t.longname && t.longname.match(element.memberof)) {
      if (element.memberof === t.longname) {
        t.properties.push(createSettingFromExplanation(element));
      } else {
        findNodeForElement(element, t.properties);
      }
    }
  });
  if (tree.length == 0) {
    tree.push(createSettingFromExplanation(element));
  }
  return tree;
}

function createSettingFromExplanation(explanation: JSDocExplanation): Setting {
  let setting: Setting = {
    name: explanation.name,
    longname: explanation.longname,
    description: explanation.description,
    properties: [],
    path: [explanation.name],
    type: Type.group,
  };
  if (explanation.properties && explanation.properties.length > 0) {
    setting.properties = explanation.properties.map(c => createSettingFromExplanation(c));
  }
  return setting;
}
