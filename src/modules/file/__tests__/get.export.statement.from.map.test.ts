import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { getExportStatementFromMap } from '#/modules/file/getExportStatementFromMap';
import { filenamify } from '#/modules/path/filenamify';
import { replaceSepToPosix } from 'my-node-fp';
import { describe, expect, it } from 'vitest';

describe('getExportStatementFromMap', () => {
  const filename01 = 'hello.ts';
  const filename02 = 'world.ts';
  const statement01: IExportStatement[] = [
    {
      path: {
        filename: filename01,
        dirPath: replaceSepToPosix(process.cwd()),
        relativePath: '..',
      },
      depth: 2,
      pos: {
        line: 1,
        column: 1,
      },
      identifier: { name: 'Hero', alias: filenamify(filename01) },
      isAnonymous: false,
      isPureType: false,
      isDefault: false,
      isExcluded: false,
      comments: [],
    },
  ];
  const statement02: IExportStatement[] = [
    {
      path: {
        filename: filename02,
        dirPath: replaceSepToPosix(process.cwd()),
        relativePath: '..',
      },
      depth: 2,
      pos: {
        line: 9,
        column: 1,
      },
      identifier: { name: 'Ability', alias: filenamify(filename02) },
      isAnonymous: false,
      isPureType: false,
      isDefault: false,
      isExcluded: false,
      comments: [],
    },
  ];

  const map = new Map<string, IExportStatement[]>([
    [filename01, statement01],
    [filename02, statement02],
  ]);

  it('find from the map', () => {
    const result = getExportStatementFromMap(filename01, map);
    expect(result).toEqual(statement01);
  });

  it('cannot find from the map', () => {
    const result = getExportStatementFromMap('cannot-found-this-name', map);
    expect(result).toEqual([]);
  });
});
