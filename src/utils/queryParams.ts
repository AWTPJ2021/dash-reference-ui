import { SettingsMap, SettingsMapValue } from '../types/types';

export function setParam(key: string, value: SettingsMapValue): void {
  const url = new URL(window.location.href);

  if (value == null) {
    url.searchParams.delete(key);
  } else {
    if (url.searchParams.has(key)) {
      url.searchParams.set(key, value.toString());
    } else {
      url.searchParams.append(key, value.toString());
    }
  }
  window.history.pushState(null, '', (url as unknown) as string);
}

export function removeQueryParams(): void {
  const url = new URL(window.location.href);
  Array.from((url.searchParams as any).keys()).forEach((key: string) => {
    url.searchParams.delete(key);
  });
  window.history.pushState(null, '', (url as unknown) as string);
}

export function updateMapWithQueryParams(settings: SettingsMap): SettingsMap {
  const updatedSettings = new Map(settings);
  const urlParams = new URLSearchParams(window.location.search);
  updatedSettings.forEach((_value, key) => {
    if (urlParams.has(key)) {
      let value: SettingsMapValue = urlParams.get(key) || undefined;
      if (value === 'true') {
        value = true;
      }
      if (value === 'false') {
        value = false;
      }
      if (typeof value != 'boolean' && !Number.isNaN(Number(value))) {
        value = Number(value);
      }
      updatedSettings.set(key, value);
    }
  });
  return updatedSettings;
}
