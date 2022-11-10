import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';
import { replaceSepToPosix } from 'my-node-fp';

export default [
  {
    depth: 0,
    resolvedDirPath: replaceSepToPosix(env.exampleType08Path),
    exportStatements: ["export * from './WildcardDeclaration';"],
    resolvedFilePaths: [posixJoin(env.exampleType08Path, 'WildcardDeclaration.ts')],
  },
];
