import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';

export default {
  depths: {
    [replaceSepToPosix(env.exampleType03Path)]: 0,
    [posixJoin(env.exampleType03Path, 'juvenile')]: 1,
    [posixJoin(env.exampleType03Path, 'popcorn')]: 1,
    [posixJoin(env.exampleType03Path, 'wellmade')]: 1,
    [posixJoin(env.exampleType03Path, 'juvenile', 'spill')]: 2,
    [posixJoin(env.exampleType03Path, 'wellmade', 'carpenter')]: 2,
    [posixJoin(env.exampleType03Path, 'popcorn', 'finance', 'discipline')]: 3,
    [posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance')]: 3,
    [posixJoin(env.exampleType03Path, 'popcorn', 'finance')]: 2,
    [posixJoin(env.exampleType03Path, 'popcorn', 'lawyer')]: 2,
  },
  dirPaths: {
    [replaceSepToPosix(env.exampleType03Path)]: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'BubbleCls.tsx'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: posixJoin('type03', 'BubbleCls.tsx'),
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'BubbleCls' }],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'ComparisonCls.tsx'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/ComparisonCls.tsx',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'ComparisonCls' }],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'HandsomelyCls.tsx'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/HandsomelyCls.tsx',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'HandsomelyCls' }],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'SampleCls.tsx'),
        resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
        relativeFilePath: 'type03/SampleCls.tsx',
        depth: 1,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'SampleCls' }],
      },
    ],
    [posixJoin(env.exampleType03Path, 'juvenile')]: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'juvenile', 'TriteCls.ts'),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'juvenile'),
        relativeFilePath: posixJoin('type03', 'juvenile/TriteCls.ts'),
        depth: 2,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'TriteCls' }],
      },
    ],
    [posixJoin(env.exampleType03Path, 'popcorn')]: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'popcorn', 'case01.ts'),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn'),
        relativeFilePath: posixJoin('type03', 'popcorn', 'case01.ts'),
        depth: 2,
        starExported: true,
        defaultExport: { identifier: 'case01' },
        namedExports: [],
      },
    ],
    [posixJoin(env.exampleType03Path, 'wellmade')]: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'wellmade', 'ChildlikeCls.ts'),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'wellmade'),
        relativeFilePath: posixJoin('type03', 'wellmade', 'ChildlikeCls.ts'),
        depth: 2,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'ChildlikeCls' }],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'wellmade', 'FlakyCls.ts'),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'wellmade'),
        relativeFilePath: posixJoin('type03', 'wellmade', 'FlakyCls.ts'),
        depth: 2,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'FlakyCls' }],
      },
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'wellmade', 'WhisperingCls.ts'),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'wellmade'),
        relativeFilePath: posixJoin('type03', 'wellmade', 'WhisperingCls.ts'),
        depth: 2,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'WhisperingCls' }],
      },
    ],
    [posixJoin(env.exampleType03Path, 'juvenile', 'spill')]: [
      {
        resolvedFilePath: posixJoin(env.exampleType03Path, 'juvenile', 'spill', 'ExperienceCls.ts'),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'juvenile', 'spill'),
        relativeFilePath: posixJoin('type03', 'juvenile', 'spill', 'ExperienceCls.ts'),
        depth: 3,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'ExperienceCls' }],
      },
    ],
    [posixJoin(env.exampleType03Path, 'wellmade', 'carpenter')]: [
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'wellmade',
          'carpenter',
          'DiscussionCls.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'wellmade', 'carpenter'),
        relativeFilePath: posixJoin('type03', 'wellmade', 'carpenter', 'DiscussionCls.ts'),
        depth: 3,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'DiscussionCls' }],
      },
      {
        resolvedFilePath: posixJoin(
          env.exampleType03Path,
          'wellmade',
          'carpenter',
          'MakeshiftCls.ts',
        ),
        resolvedDirPath: posixJoin(env.exampleType03Path, 'wellmade', 'carpenter'),
        relativeFilePath: posixJoin('type03', 'wellmade', 'carpenter', 'MakeshiftCls.ts'),
        depth: 3,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'MakeshiftCls' }],
      },
    ],
    [posixJoin(env.exampleType03Path, 'popcorn', 'finance', 'discipline')]: [
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
        relativeFilePath: posixJoin('type03', 'popcorn', 'finance', 'discipline', 'case03.ts'),
        depth: 4,
        starExported: true,
        defaultExport: { identifier: 'Case03' },
        namedExports: [],
      },
    ],
    [posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance')]: [
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
        relativeFilePath: posixJoin('type03', 'popcorn', 'lawyer', 'appliance', 'TomatoesCls.ts'),
        depth: 4,
        starExported: true,
        defaultExport: undefined,
        namedExports: [{ identifier: 'TomatoesCls' }],
      },
    ],
    [posixJoin(env.exampleType03Path, 'popcorn', 'finance')]: [],
    [posixJoin(env.exampleType03Path, 'popcorn', 'lawyer')]: [],
  },
};
