import * as env from '#/testenv/env';
import { posixJoin } from '#/tools/misc';

export default [
  {
    depth: 1,
    resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn'),
    exportStatement: "export * from './finance/discipline';",
  },
  {
    depth: 1,
    resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn'),
    exportStatement: "export * from './lawyer/appliance';",
  },
];
