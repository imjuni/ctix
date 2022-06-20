import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';

export default [
  {
    depth: 0,
    resolvedDirPath: replaceSepToPosix(env.exampleType04Path),
    resolvedFilePaths: [
      posixJoin(env.exampleType04Path, 'wellmade/carpenter/DiscussionCls.ts'),
      posixJoin(env.exampleType04Path, 'wellmade/carpenter/MakeshiftCls.ts'),
      posixJoin(env.exampleType04Path, 'wellmade/ChildlikeCls.ts'),
      posixJoin(env.exampleType04Path, 'BubbleCls.tsx'),
      posixJoin(env.exampleType04Path, 'ComparisonCls.tsx'),
      posixJoin(env.exampleType04Path, 'createTypeScriptIndex.d.ts'),
      posixJoin(env.exampleType04Path, 'HandsomelyCls.tsx'),
      posixJoin(env.exampleType04Path, 'index.tsx'),
      posixJoin(env.exampleType04Path, 'SampleCls.tsx'),
      posixJoin(env.exampleType04Path, 'SampleEnum.ts'),
    ],
    exportStatements: [
      "export * from './wellmade/carpenter/DiscussionCls';",
      "export * from './wellmade/carpenter/MakeshiftCls';",
      "export { ChildlikeCls, document } from './wellmade/ChildlikeCls';",
      "export * from './BubbleCls';",
      "export * from './ComparisonCls';",
      "export * from './createTypeScriptIndex.d.ts';",
      "export * from './HandsomelyCls';",
      "export * from './index.tsx';",
      "export { default as ReactApplication } from './index.tsx';",
      "export * from './SampleCls';",
      "export * from './SampleEnum';",
      "export { default as JobType } from './SampleEnum';",
    ],
  },
];
