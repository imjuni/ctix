import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';

export default [
  {
    dirPath: posixJoin(env.exampleType03Path, 'popcorn'),
    isTerminal: false,
    depth: 1,
    exportInfos: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'popcorn', 'case01.ts'),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn'),
        relativeFilePath: 'popcorn/case01.ts',
        depth: 2,
        starExported: true,
        defaultExport: {
          identifier: 'case01',
        },
        namedExports: [],
      },
    ],
  },
  {
    dirPath: posixJoin(env.exampleType03Path, 'popcorn', 'finance'),
    isTerminal: false,
    depth: 2,
    exportInfos: [],
  },
  {
    dirPath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer'),
    isTerminal: false,
    depth: 2,
    exportInfos: [],
  },
  {
    dirPath: posixJoin(env.exampleType03Path, 'popcorn', 'finance', 'discipline'),
    isTerminal: true,
    depth: 3,
    exportInfos: [
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'popcorn',
          'finance',
          'discipline',
          'case02.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn', 'finance', 'discipline'),
        relativeFilePath: posixJoin('popcorn', 'finance', 'discipline', 'case02.ts'),
        depth: 4,
        starExported: true,
        defaultExport: { identifier: 'case02' },
        namedExports: [],
      },
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'popcorn',
          'finance',
          'discipline',
          'case03.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn', 'finance', 'discipline'),
        relativeFilePath: posixJoin('popcorn', 'finance', 'discipline', 'case03.ts'),
        depth: 4,
        starExported: true,
        defaultExport: { identifier: 'Case03' },
        namedExports: [],
      },
    ],
  },
  {
    dirPath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance'),
    isTerminal: true,
    depth: 3,
    exportInfos: [
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'popcorn',
          'lawyer',
          'appliance',
          'IKittens.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance'),
        relativeFilePath: posixJoin('popcorn', 'lawyer', 'appliance', 'IKittens.ts'),
        depth: 4,
        starExported: true,
        defaultExport: { identifier: 'IKittens' },
        namedExports: [],
      },
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'popcorn',
          'lawyer',
          'appliance',
          'TomatoesCls.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance'),
        relativeFilePath: posixJoin('popcorn', 'lawyer', 'appliance', 'TomatoesCls.ts'),
        depth: 4,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'TomatoesCls' }],
      },
    ],
  },
];
