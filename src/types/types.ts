export interface Setting {
  name: string;
  id: string;
  parent: string;
  /**
   * Includes all parent nodes, but not the Setting itself.
   */
  path: string[];
  example: string;
  required: boolean;
  description: string;
  type: Type;
  enum?: any;
  /**
   * If this element is selected to be displayed in the settings control panel
   */
  activated: boolean;
}

export enum Type {
  string = 'string',
  number = 'number',
  object = 'Object',
  boolean = 'boolean',
  group = 'group',
}
