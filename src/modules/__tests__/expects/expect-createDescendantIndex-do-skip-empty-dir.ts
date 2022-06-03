import * as env from '@testenv/env';
import { posixJoin } from '@tools/misc';

export default [
  {
    depth: 1,
    resolvedDirPath: posixJoin(env.exampleType03Path, 'juvenile'),
    resolvedFilePath: undefined,
    exportStatement: "export * from './spill';",
  },
  {
    depth: 1,
    resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn'),
    resolvedFilePath: undefined,
    exportStatement: "export * from './finance/discipline';",
  },
  {
    depth: 1,
    resolvedDirPath: posixJoin(env.exampleType03Path, 'popcorn'),
    resolvedFilePath: undefined,
    exportStatement: "export * from './lawyer/appliance';",
  },
  {
    depth: 1,
    resolvedDirPath: posixJoin(env.exampleType03Path, 'wellmade'),
    resolvedFilePath: undefined,
    exportStatement: "export * from './carpenter';",
  },
];
