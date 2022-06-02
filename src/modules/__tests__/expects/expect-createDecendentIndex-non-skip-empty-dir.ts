import * as env from '@testenv/env';
import { replaceSepToPosix } from 'my-node-fp';

export default [
  {
    depth: 0,
    resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
    resolvedFilePath: undefined,
    exportStatement: "export * from './juvenile'",
  },
  {
    depth: 0,
    resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
    resolvedFilePath: undefined,
    exportStatement: "export * from './popcorn'",
  },
  {
    depth: 0,
    resolvedDirPath: replaceSepToPosix(env.exampleType03Path),
    resolvedFilePath: undefined,
    exportStatement: "export * from './wellmade'",
  },
];
