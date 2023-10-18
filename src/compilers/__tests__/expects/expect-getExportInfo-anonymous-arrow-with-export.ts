import * as env from '#/testenv/env';
import { posixJoin } from '#/tools/misc';

export default {
  isEmpty: false,
  resolvedFilePath: posixJoin(env.exampleType03Path, '/popcorn/lawyer/appliance/bomb.ts'),
  resolvedDirPath: posixJoin(env.exampleType03Path, '/popcorn/lawyer/appliance'),
  relativeFilePath: 'popcorn/lawyer/appliance/bomb.ts',
  depth: 4,
  starExported: true,
  defaultExport: {
    identifier: 'bomb',
    isIsolatedModules: false,
  },
  namedExports: [
    {
      identifier: 'bomb',
      isIsolatedModules: false,
    },
  ],
};
