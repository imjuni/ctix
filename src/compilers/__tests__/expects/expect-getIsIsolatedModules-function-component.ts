import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';

export default [
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(env.exampleType10Path, 'components/index.ts'),
    resolvedDirPath: posixJoin(env.exampleType10Path, 'components'),
    relativeFilePath: 'components/index.ts',
    depth: 1,
    starExported: true,
    namedExports: [{ identifier: 'ReactComponent', isIsolatedModules: false }],
  },
];
