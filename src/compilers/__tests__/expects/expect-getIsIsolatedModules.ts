import * as env from '#/testenv/env';
import { posixJoin } from '#/tools/misc';

export default [
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(env.exampleType07Path, 'Foo.ts'),
    resolvedDirPath: env.exampleType07Path,
    relativeFilePath: 'Foo.ts',
    depth: 0,
    starExported: false,
    namedExports: [
      {
        identifier: 'Foo',
        isIsolatedModules: true,
      },
    ],
  },
  {
    isEmpty: false,
    resolvedFilePath: posixJoin(env.exampleType07Path, 'Bar.ts'),
    resolvedDirPath: env.exampleType07Path,
    relativeFilePath: 'Bar.ts',
    depth: 0,
    starExported: false,
    namedExports: [
      {
        identifier: 'Bar',
        isIsolatedModules: true,
      },
    ],
  },
];
