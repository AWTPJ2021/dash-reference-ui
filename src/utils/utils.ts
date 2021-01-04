import { Setting, DashFunction } from '../types/types';
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