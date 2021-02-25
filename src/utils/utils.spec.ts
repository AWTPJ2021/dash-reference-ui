import { Setting, Type } from '../types/types';
import { generateSettingsMapFromList, generateSettingsObjectFromListAndMap } from './utils';

describe('generateSettingsMapFromList', () => {
  it('empty', async () => {
    const list: Setting[] = [];
    expect(generateSettingsMapFromList(list)).toEqual(new Map());
  });
  it('filled', async () => {
    const list: Setting[] = [
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

describe('generateSettingsObjectFromListAndMap', () => {
  it('empty', async () => {
    const list: Setting[] = [];
    const map = new Map();
    expect(generateSettingsObjectFromListAndMap(list, map)).toEqual({});
  });
  it('filled', async () => {
    const list: Setting[] = [
      {
        type: Type.number,
        description: 'Sets up the log level. The levels are cumulative. …ug.LOG_LEVEL_DEBUG<br/>↵Log debug messages.↵</ul>',
        required: false,
        id: 'settings.debug.logLevel',
        name: 'logLevel',
        parent: 'debug',
        path: ['settings', 'debug'],
        activated: true,
        example: '0',
      },
    ];
    const map = new Map([['settings.debug.logLevel', '5']]);
    expect(generateSettingsObjectFromListAndMap(list, map)).toEqual({
      debug: {
        logLevel: '5',
      },
    });
  });
});
