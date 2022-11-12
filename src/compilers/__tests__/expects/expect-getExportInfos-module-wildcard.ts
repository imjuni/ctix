import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';

export default [
  {
    resolvedFilePath: posixJoin(env.exampleType08Path, 'WildcardDeclaration.ts'),
    resolvedDirPath: replaceSepToPosix(env.exampleType08Path),
    relativeFilePath: posixJoin('WildcardDeclaration.ts'),
    depth: 0,
    isEmpty: false,
    starExported: true,
    namedExports: [
      {
        identifier: 'Friend',
        isIsolatedModules: false,
        moduleDeclaration: "'*.ttf'",
      },
      {
        identifier: 'AlsoFriend',
        isIsolatedModules: false,
        moduleDeclaration: "'*.ttf'",
      },
    ],
  },
];
