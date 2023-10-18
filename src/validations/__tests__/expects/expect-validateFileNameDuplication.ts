import * as env from '#/testenv/env';
import { posixJoin } from '#/tools/misc';
import chalk from 'chalk';
import { replaceSepToPosix } from 'my-node-fp';

export default {
  valid: false,
  exportInfos: [
    {
      resolvedFilePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
      relativeFilePath: 'index.d.ts',
      depth: 0,
      isEmpty: false,
      starExported: true,
      defaultExport: undefined,
      namedExports: [
        { identifier: 'indexWriter', isIsolatedModules: false },
        { identifier: 'createTypeScriptIndex', isIsolatedModules: false },
        { identifier: 'ICreateTsIndexOption', isIsolatedModules: true },
      ],
    },
  ],
  filePaths: [posixJoin(env.exampleType03Path, 'index.d.ts')],
  reasons: [
    {
      type: 'error',
      filePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      message: `already exist file: "${chalk.yellow(
        posixJoin(env.exampleType03Path, 'index.d.ts'),
      )}"`,
    },
  ],
};
