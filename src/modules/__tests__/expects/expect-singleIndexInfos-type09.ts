import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';

export default [
  {
    depth: 1,
    resolvedDirPath: env.exampleType09Path,
    resolvedFilePaths: [
      posixJoin(env.exampleType09Path, 'components/index.ts'),
      posixJoin(env.exampleType09Path, 'lib/something.ts'),
    ],
    exportStatements: ["export * from './components';", "export * from './lib/something';"],
  },
];
