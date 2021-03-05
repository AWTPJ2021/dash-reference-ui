export class LocalStorage {
  static deleteKeyInKeyValueObject(key: string, id: string): void {
    const toUpdate = JSON.parse(localStorage.getItem(key));
    delete toUpdate[id];
    localStorage.setItem(key, JSON.stringify(toUpdate));
  }

  static updateKeyInKeyValueObject(key: string, id: string, value: any): void {
    const toUpdate = JSON.parse(localStorage.getItem(key)) || {};
    toUpdate[id] = value;
    localStorage.setItem(key, JSON.stringify(toUpdate));
  }

  static saveMapToLocalKey(localKey: string, map: Map<string, any>): void {
    const toSave = {};
    map.forEach((value, key) => {
      if (value != undefined) {
        toSave[key] = value;
      }
    });
    localStorage.setItem(localKey, JSON.stringify(toSave));
  }

  static getKeyValueObject(key: string): null | any {
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
export class LocalVariableStore {
  static set mediaUrl(value: string) {
    localStorage.setItem(STRING_MEDIA_URL, value);
  }
  static get mediaUrl(): string {
    if (localStorage.getItem(STRING_MEDIA_URL) != null && localStorage.getItem(STRING_MEDIA_URL) != '' && localStorage.getItem(STRING_MEDIA_URL) != 'null') {
      return localStorage.getItem(STRING_MEDIA_URL);
    }
    return 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
  }
  static resetMediaUrl(): void {
    LocalVariableStore.mediaUrl = null;
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
}
