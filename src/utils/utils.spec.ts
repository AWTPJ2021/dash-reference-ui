import { Setting, Type } from '../types/types';
import { generateSettingsMapFromList } from './utils';

describe('generateSettingsMapFromList', () => {
  it('empty', async () => {
    let list: Setting[] = [];
    expect(generateSettingsMapFromList(list)).toEqual(new Map());
  });
  it('filled', async () => {
    let list: Setting[] = [
      {
        id: 'test',
        activated: false,
        name: 'test',
        description: 'test',
        example: '',
        parent: undefined,
        path: [],
        required: false,
        type: Type.boolean,
      },
    ];
    expect(generateSettingsMapFromList(list)).toEqual(new Map([['test', undefined]]));
  });
});
