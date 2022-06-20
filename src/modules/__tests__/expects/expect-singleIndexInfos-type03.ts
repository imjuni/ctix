import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';

export default [
  {
    depth: 0,
    resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
    resolvedFilePaths: [
      posixJoin(env.exampleType03Path, 'popcorn/finance/discipline/case02.ts'),
      posixJoin(env.exampleType03Path, 'popcorn/finance/discipline/case03.ts'),
      posixJoin(env.exampleType03Path, 'popcorn/lawyer/appliance/IKittens.ts'),
      posixJoin(env.exampleType03Path, 'popcorn/lawyer/appliance/TomatoesCls.ts'),
      posixJoin(env.exampleType03Path, 'juvenile/spill/ExperienceCls.ts'),
      posixJoin(env.exampleType03Path, 'wellmade/carpenter/DiscussionCls.ts'),
      posixJoin(env.exampleType03Path, 'wellmade/carpenter/MakeshiftCls.ts'),
      posixJoin(env.exampleType03Path, 'juvenile/TriteCls.ts'),
      posixJoin(env.exampleType03Path, 'popcorn/case01.ts'),
      posixJoin(env.exampleType03Path, 'popcorn/index.d.ts'),
      posixJoin(env.exampleType03Path, 'wellmade/ChildlikeCls.ts'),
      posixJoin(env.exampleType03Path, 'wellmade/FlakyCls.ts'),
      posixJoin(env.exampleType03Path, 'wellmade/WhisperingCls.ts'),
      posixJoin(env.exampleType03Path, 'BubbleCls.tsx'),
      posixJoin(env.exampleType03Path, 'ComparisonCls.tsx'),
      posixJoin(env.exampleType03Path, 'HandsomelyCls.tsx'),
      posixJoin(env.exampleType03Path, 'SampleCls.tsx'),
    ],
    exportStatements: [
      "export { default as case02 } from './popcorn/finance/discipline/case02';",
      "export { default as Case03 } from './popcorn/finance/discipline/case03';",
      "export { default as IKittens } from './popcorn/lawyer/appliance/IKittens';",
      "export * from './popcorn/lawyer/appliance/TomatoesCls';",
      "export * from './juvenile/spill/ExperienceCls';",
      "export * from './wellmade/carpenter/DiscussionCls';",
      "export * from './wellmade/carpenter/MakeshiftCls';",
      "export * from './juvenile/TriteCls';",
      "export { default as case01 } from './popcorn/case01';",
      "export * from './popcorn/index.d.ts';",
      "export * from './wellmade/ChildlikeCls';",
      "export * from './wellmade/FlakyCls';",
      "export * from './wellmade/WhisperingCls';",
      "export * from './BubbleCls';",
      "export * from './ComparisonCls';",
      "export * from './HandsomelyCls';",
      "export * from './SampleCls';",
    ],
  },
];
