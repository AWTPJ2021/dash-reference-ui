import { Setting } from '../types/types';
import * as objectPath from 'object-path';

export function generateSettingsMapFromList(list: Setting[]) {
  let map = new Map();
  list.forEach(element => {
    map.set(element.id, true);
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
