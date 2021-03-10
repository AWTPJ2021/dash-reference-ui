export interface Setting {
  name: string;
  id: string;
  parent: string | undefined;
  /**
   * Includes all parent nodes, but not the Setting itself.
   */
  path: string[];
  example: string;
  required: boolean;
  description: string;
  type: Type;
  enum?: string[];
  enumLabels?: string[];
  /**
   * If this element is selected to be displayed in the settings control panel
   */
  activated: boolean;
}

export type SettingsMap = Map<string, SettingsMapValue>;

export type SettingsMapValue = boolean | string | number | undefined;
export interface KeyValue<T> {
  [key: string]: T;
}

export interface DashFunction {
  name: string;
  description: string;
  parameters: DashPara[];
  paramExplanation: DashParaExplaination[];
  type: Type;
}

export interface DashPara {
  name: string;
  description: string;
  type: Type;
}

export interface DashParaExplaination {
  name: string;
  description: string;
}

export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
  TEXT = 'text',
  FRAGMENTEDTEXT = 'fragmentedText',
  EMBEDDEDTEXT = 'embeddedText',
  IMAGE = 'image',
}

export enum Type {
  string = 'string',
  number = 'number',
  object = 'Object',
  boolean = 'boolean',
  HTML5MediaElement = 'HTMLElement',
  function = '(e: any) => void',
  value = 'value',
  void = 'void',
  MediaType = 'MediaType',
}

export interface Tree {
  name: string;
  child?: { [name: string]: Tree };
  elements: string[];
}

export interface Metrics {
  video: {
    'Buffer Length': number,
    'Bitrate Downloading': number,
    'Dropped Frames': number,
    'Frame Rate': number,
    'Index': number,
    'Max Index': number,
    'Live Latency': number,
    'Latency': string,
    'Download': string,
    'Ratio': string,
  },
  audio: {
    'Buffer Length': number,
    'Bitrate Downloading': number,
    'Dropped Frames': number,
    'Max Index': number,
    'Latency': string,
    'Download': string,
    'Ratio': string,
  },
  currentTime: string,
}

export interface Colors {
  'Buffer Length': string,
  'Bitrate Downloading': string,
  'Dropped Frames': string,
  'Frame Rate': string,
  'Index': string,
  'Max Index': string,
  'Live Latency': string,
  'Latency': string,
  'Download': string,
  'Ratio': string,
}
