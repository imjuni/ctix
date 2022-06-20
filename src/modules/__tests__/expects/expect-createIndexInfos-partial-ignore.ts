import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';

export default [
  {
    depth: 2,
    resolvedDirPath: posixJoin(env.exampleType04Path, 'wellmade', 'carpenter'),
    exportStatements: ["export * from './DiscussionCls';", "export * from './MakeshiftCls';"],
    resolvedFilePaths: [
      posixJoin(env.exampleType04Path, 'wellmade', 'carpenter', 'DiscussionCls.ts'),
      posixJoin(env.exampleType04Path, 'wellmade', 'carpenter', 'MakeshiftCls.ts'),
    ],
  },
  {
    depth: 1,
    resolvedDirPath: posixJoin(env.exampleType04Path, 'wellmade'),
    exportStatements: [
      "export { ChildlikeCls, document } from './ChildlikeCls';",
      "export * from './carpenter';",
    ],
    resolvedFilePaths: [posixJoin(env.exampleType04Path, 'wellmade', 'ChildlikeCls.ts')],
  },
  {
    depth: 0,
    resolvedDirPath: replaceSepToPosix(env.exampleType04Path),
    exportStatements: [
      "export { default as JobType } from './SampleEnum';",
      "export * from './BubbleCls';",
      "export * from './ComparisonCls';",
      "export * from './createTypeScriptIndex.d.ts';",
      "export * from './HandsomelyCls';",
      "export * from './SampleCls';",
      "export * from './SampleEnum';",
      "export * from './wellmade';",
    ],
    resolvedFilePaths: [
      posixJoin(env.exampleType04Path, 'BubbleCls.tsx'),
      posixJoin(env.exampleType04Path, 'ComparisonCls.tsx'),
      posixJoin(env.exampleType04Path, 'createTypeScriptIndex.d.ts'),
      posixJoin(env.exampleType04Path, 'HandsomelyCls.tsx'),
      posixJoin(env.exampleType04Path, 'SampleCls.tsx'),
      posixJoin(env.exampleType04Path, 'SampleEnum.ts'),
    ],
  },
];
