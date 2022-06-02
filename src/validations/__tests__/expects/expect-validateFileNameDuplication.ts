import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';

export default {
  valid: false,
  exportInfos: [
    {
      resolvedFilePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
      relativeFilePath: 'type03/index.d.ts',
      depth: 3,
      starExported: true,
      defaultExport: undefined,
      namedExports: [
        { identifier: 'indexWriter' },
        { identifier: 'createTypeScriptIndex' },
        { identifier: 'ICreateTsIndexOption' },
      ],
    },
    {
      resolvedFilePath: posixJoin(env.exampleType03Path, 'popcorn', 'index.d.ts'),
      resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn'),
      relativeFilePath: posixJoin('type03', 'popcorn', 'index.d.ts'),
      depth: 4,
      starExported: true,
      defaultExport: undefined,
      namedExports: [],
    },
  ],
  filePaths: [
    posixJoin(env.exampleType03Path, 'index.d.ts'),
    posixJoin(env.exampleType03Path, 'popcorn', 'index.d.ts'),
  ],
  reasons: [
    {
      type: 'error',
      filePath: posixJoin(env.exampleType03Path, 'index.d.ts'),
      message: `already exist file: ${posixJoin(env.exampleType03Path, 'index.d.ts')}`,
    },
    {
      type: 'error',
      filePath: posixJoin(env.exampleType03Path, 'popcorn', 'index.d.ts'),
      message: `already exist file: ${posixJoin(env.exampleType03Path, 'popcorn', 'index.d.ts')}`,
    },
  ],
};
