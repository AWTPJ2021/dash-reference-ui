import { KeyValue } from '../types/types';

export class LocalStorage {
  static deleteKeyInKeyValueObject(key: string, id: string): void {
    const toUpdate = JSON.parse(localStorage.getItem(key) || '{}');
    delete toUpdate[id];
    localStorage.setItem(key, JSON.stringify(toUpdate));
  }

  static updateKeyInKeyValueObject(key: string, id: string, value: unknown): void {
    const toUpdate = JSON.parse(localStorage.getItem(key) || '{}');
    toUpdate[id] = value;
    localStorage.setItem(key, JSON.stringify(toUpdate));
  }

  static saveMapToLocalKey(localKey: string, map: Map<string, unknown>): void {
    const toSave = {};
    map.forEach((value, key) => {
      if (value != undefined) {
        toSave[key] = value;
      }
    });
    localStorage.setItem(localKey, JSON.stringify(toSave));
  }

  static getMapFromLocalKey(key: string): Map<string, string> {
    const info = JSON.parse(localStorage.getItem(key) || '{}');
    const map = new Map();
    Object.keys(info).forEach(key => {
      if (info[key] != undefined) {
        map.set(key, info[key]);
      }
    });
    return map;
  }

  static getKeyValueObject(key: string): null | KeyValue<unknown> {
    const info = localStorage.getItem(key);
    return info != null ? JSON.parse(info) : null;
  }

  static deleteKey(key: string): void {
    localStorage.removeItem(key);
  }
}

const STRING_MEDIA_URL = 'mediaUrl';
const STRING_API_AUTOSTART = 'api_autostart';
const STRING_SETTINGS_AUTOUPDATE = 'settings_autoupdate';
const STRING_DARKMODE_ACTIVE = 'settings_darkmode_active';
export class LocalVariableStore {
  static set mediaUrl(value: string) {
    localStorage.setItem(STRING_MEDIA_URL, value);
  }
  static get mediaUrl(): string {
    const mediaUrl = localStorage.getItem(STRING_MEDIA_URL);
    if (mediaUrl != null && mediaUrl != '' && mediaUrl != 'null') {
      return mediaUrl;
    }
    return 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
  }
  static resetMediaUrl(): void {
    LocalVariableStore.mediaUrl = '';
  }

  static set api_autostart(value: boolean) {
    localStorage.setItem(STRING_API_AUTOSTART, String(value));
  }
  static get api_autostart(): boolean {
    return localStorage.getItem(STRING_API_AUTOSTART) === null ? true : localStorage.getItem(STRING_API_AUTOSTART) === 'true';
  }

  static set settings_autoupdate(value: boolean) {
    localStorage.setItem(STRING_SETTINGS_AUTOUPDATE, String(value));
  }
  static get settings_autoupdate(): boolean {
    return localStorage.getItem(STRING_SETTINGS_AUTOUPDATE) === null ? true : localStorage.getItem(STRING_SETTINGS_AUTOUPDATE) === 'true';
  }

  static set darkmode_active(value: boolean) {
    localStorage.setItem(STRING_DARKMODE_ACTIVE, String(value));
  }
  static get darkmode_active(): boolean {
    return localStorage.getItem(STRING_DARKMODE_ACTIVE) === null ? true : localStorage.getItem(STRING_DARKMODE_ACTIVE) === 'true';
  }
  static darkmode_activeSet(): boolean {
    return localStorage.getItem(STRING_DARKMODE_ACTIVE) != undefined;
  }
}
