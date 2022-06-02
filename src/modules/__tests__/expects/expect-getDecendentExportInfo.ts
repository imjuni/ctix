import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';

export default [
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
        relativeFilePath: posixJoin('type03', 'popcorn', 'finance', 'discipline', 'case02.ts'),
        depth: 4,
        starExported: true,
        defaultExport: 'case02',
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
        relativeFilePath: posixJoin('type03', 'popcorn', 'finance', 'discipline', 'case03.ts'),
        depth: 4,
        starExported: true,
        defaultExport: 'Case03',
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
        relativeFilePath: posixJoin('type03', 'popcorn', 'lawyer', 'appliance', 'IKittens.ts'),
        depth: 4,
        starExported: true,
        defaultExport: 'IKittens',
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
        relativeFilePath: posixJoin('type03', 'popcorn', 'lawyer', 'appliance', 'TomatoesCls.ts'),
        depth: 4,
        starExported: true,
        defaultExport: undefined,
        namedExports: ['TomatoesCls'],
      },
    ],
  },
];
