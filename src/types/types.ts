export interface Setting {
  name: string;
  longname: string;
  description: string;
  path: string[];
  type: Type;
  properties: Setting[];
  optional?: boolean;
  defaultValue?: any;
}

export enum Type {
  string = 'string',
  number = 'number',
  object = 'Object',
  boolean = 'boolean',
  group = 'group',
}

export interface JSDocExplanation {
  comment: string;
  meta: any;
  kind: string;
  name: string;
  description: string;
  see: string[];
  longname: string;
  type?: {
    names: string[1];
  };
  properties: JSDocExplanation[];
  optional?: boolean;
  examples: string[];
  scope: string;
  memberof: string;
  undocumented: boolean;
  defaultvalue: any
}
