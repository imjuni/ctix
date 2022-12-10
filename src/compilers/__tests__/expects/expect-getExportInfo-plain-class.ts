import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';

export default {
  isEmpty: false,
  resolvedFilePath: posixJoin(env.exampleType04Path, '/fast-maker/ChildlikeCls.ts'),
  resolvedDirPath: posixJoin(env.exampleType04Path, '/fast-maker'),
  relativeFilePath: 'fast-maker/ChildlikeCls.ts',
  depth: 1,
  starExported: true,
  defaultExport: {
    identifier: 'ChildlikeCls',
    isIsolatedModules: false,
  },
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
};
