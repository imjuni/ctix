import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';

export default [
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(env.exampleType06Path, 'case001.ts'),
    resolvedDirPath: replaceSepToPosix(env.exampleType06Path),
    relativeFilePath: 'case001.ts',
    depth: 0,
    starExported: false,
    namedExports: [
      {
        identifier: 'flaky',
        isIsolatedModules: false,
      },
      {
        identifier: 'childlike',
        isIsolatedModules: false,
      },
    ],
  },
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(env.exampleType06Path, 'fast-maker', 'ChildlikeCls.ts'),
    resolvedDirPath: posixJoin(env.exampleType06Path, 'fast-maker'),
    relativeFilePath: posixJoin('fast-maker', 'ChildlikeCls.ts'),
    depth: 1,
    starExported: true,
    namedExports: [
      {
        identifier: 'ChildlikeCls',
        isIsolatedModules: false,
      },
      {
        identifier: 'name',
        isIsolatedModules: false,
      },
      {
        identifier: 'greeting',
        isIsolatedModules: false,
      },
    ],
  },
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(env.exampleType06Path, 'fast-maker', 'FlakyCls.ts'),
    resolvedDirPath: posixJoin(env.exampleType06Path, 'fast-maker'),
    relativeFilePath: posixJoin('fast-maker', 'FlakyCls.ts'),
    depth: 1,
    starExported: true,
    namedExports: [
      {
        identifier: 'FlakyCls',
        isIsolatedModules: false,
      },
    ],
  },
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(env.exampleType06Path, 'fast-maker', 'WhisperingCls.ts'),
    resolvedDirPath: posixJoin(env.exampleType06Path, 'fast-maker'),
    relativeFilePath: posixJoin('fast-maker', 'WhisperingCls.ts'),
    depth: 1,
    starExported: true,
    namedExports: [
      {
        identifier: 'WhisperingCls',
        isIsolatedModules: false,
      },
    ],
  },
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(
      env.exampleType06Path,
      'fast-maker',
      'carpenter',
      'DiscussionCls.ts',
    ),
    resolvedDirPath: posixJoin(env.exampleType06Path, 'fast-maker', 'carpenter'),
    relativeFilePath: posixJoin('fast-maker', 'carpenter', 'DiscussionCls.ts'),
    depth: 2,
    starExported: true,
    namedExports: [
      {
        identifier: 'DiscussionCls',
        isIsolatedModules: false,
      },
    ],
  },
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(
      env.exampleType06Path,
      'fast-maker',
      'carpenter',
      'MakeshiftCls.ts',
    ),
    resolvedDirPath: posixJoin(env.exampleType06Path, 'fast-maker', 'carpenter'),
    relativeFilePath: posixJoin('fast-maker', 'carpenter', 'MakeshiftCls.ts'),
    depth: 2,
    starExported: true,
    namedExports: [
      {
        identifier: 'MakeshiftCls',
        isIsolatedModules: false,
      },
    ],
  },
];
