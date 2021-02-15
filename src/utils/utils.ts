import { Setting, DashFunction, Tree } from '../types/types';
import * as objectPath from 'object-path';

export function generateSettingsMapFromList(list: Setting[]) {
  let map = new Map();
  list.forEach(element => {
    map.set(element.id, undefined);
  });
  return map;
}

export function generateSettingsObjectFromListAndMap(list: Setting[], map: Map<string, boolean>) {
  let object = {
    settings: undefined,
  };
  list.forEach(element => {
    objectPath.set(object, element.id, map.get(element.id));
  });
  return object.settings;
}

export function generateFunctionsMapFromList(list: DashFunction[]) {
  let map = new Map();
  list.forEach(element => {
    map.set(element.name, undefined);
  });
  return map;
}

export function generateFunctionsObjectFromListAndMap(list: DashFunction[], map: Map<string, boolean>) {
  let object = {
    functions: undefined,
  };
  list.forEach(element => {
    objectPath.set(object, element.name, map.get(element.name));
  });
  return object.functions;
}
export function settingsListToTree(list: Setting[]): Tree {
  // Ignore first element in path as this is the root
  let root: Tree = {
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


export function deleteLocalKey(key : string, id : string) {
  var toUpdate = JSON.parse(localStorage.getItem(key));
  delete toUpdate[id];
  localStorage.setItem('api_functions', JSON.stringify(toUpdate));
}

export function updateLocalKey(key : string, id : string, value : any) {
    var toUpdate = JSON.parse(localStorage.getItem(key));
    toUpdate[id] = value;
    localStorage.setItem(key, JSON.stringify(toUpdate));
}

export function saveMapToLocalKey(localKey: string, map : Map<string, any>) {
  var toSave = {};
  map.forEach((value, key) => {
    if(value != undefined) {
      toSave[key] = value;
    }
  });
  localStorage.setItem(localKey, JSON.stringify(toSave));
}

export function getLocalInformation(key : string) {
  var info = localStorage.getItem(key);
  return info != null ? JSON.parse(info) : null;
}

export function deleteLocalInformation(key : string) {
  localStorage.removeItem(key);
}


export function getMediaURL() {
  return localStorage.getItem("mediaUrl") === null ? 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd' : localStorage.getItem('mediaUrl');
}

export function setMediaURL(url : string) {
  localStorage.setItem('mediaUrl', url);
}

export function resetMediaURL() {
  localStorage.removeItem('mediaUrl');
}

export function saveStringLocally(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function deleteStringLocally(key: string) {
  localStorage.removeItem(key);
}

export function getStringLocally(key : string) {
  return localStorage.getItem(key);
}