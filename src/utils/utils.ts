import { Setting, DashFunction, Tree } from '../types/types';
import * as objectPath from 'object-path';

export function generateSettingsMapFromList(list: Setting[]): Map<string, unknown> {
  const map = new Map();
  list.forEach(element => {
    map.set(element.id, undefined);
  });
  return map;
}

export function generateSettingsObjectFromListAndMap(list: Setting[], map: Map<string, unknown>): { [key: string]: unknown } {
  const object = {
    settings: {},
  };
  list.forEach(element => {
    const value = map.get(element.id);
    if (value != undefined) {
      objectPath.set(object, element.id, map.get(element.id));
    }
  });
  return object.settings;
}

export function generateFunctionsMapFromList(list: DashFunction[]): Map<string, unknown> {
  const map = new Map();
  list.forEach(element => {
    map.set(element.name, undefined);
  });
  return map;
}

export function generateFunctionsObjectFromListAndMap(list: DashFunction[], map: Map<string, boolean>): { [key: string]: unknown } {
  const object = {
    functions: undefined,
  };
  list.forEach(element => {
    objectPath.set(object, element.name, map.get(element.name));
  });
  return object.functions;
}
export function settingsListToTree(list: Setting[]): Tree {
  // Ignore first element in path as this is the root
  const root: Tree = {
    name: list[0].path[0],
    // child: {},
    elements: [],
  };
  list.forEach(element => {
    let nav = root;
    element.path.slice(1).forEach(subPath => {
      if (root.child == undefined) {
        root.child = {};
      }
      if (root.child[subPath] == undefined) {
        root.child[subPath] = {
          name: subPath,
          elements: [],
        };
      }
      nav = root.child[subPath];
    });
    nav.elements.push(element.id);
  });
  return root;
}
