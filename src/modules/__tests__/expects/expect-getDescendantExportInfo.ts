import * as env from '#/testenv/env';
import { posixJoin } from '#/tools/misc';

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
        depth: 1,
        isEmpty: false,
        starExported: true,
        defaultExport: {
          identifier: 'case01',
          isIsolatedModules: false,
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
        depth: 3,
        isEmpty: false,
        starExported: true,
        defaultExport: { identifier: 'case02', isIsolatedModules: false },
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
        depth: 3,
        isEmpty: false,
        starExported: true,
        defaultExport: { identifier: 'Case03', isIsolatedModules: false },
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
        depth: 3,
        isEmpty: false,
        starExported: true,
        defaultExport: { identifier: 'IKittens', isIsolatedModules: true },
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
        depth: 3,
        isEmpty: false,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'TomatoesCls', isIsolatedModules: false }],
      },
    ],
  },
];
