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
