/*
// valid ext
// '.ts', '.tsx', '.d.ts', '.js', '.jsx', '.cts', '.d.cts', '.cjs', '.mts', '.d.mts', '.mjs'.

  from checker.js
  src/compiler/checker.ts:
  src/compiler/checker.ts:            [".mts", ".mjs"],

  tests/baselines/reference/declarationEmitInvalidReferenceAllowJs.errors.txt:
  tests/cases/compiler/declarationEmitInvalidReferenceAllowJs.ts(1,22): 
  error TS6231: Could not resolve the path 'tests/cases/compiler/invalid' with the extensions: 
  '.ts', '.tsx', '.d.ts', '.js', '.jsx', '.cts', '.d.cts', '.cjs', '.mts', '.d.mts', '.mjs'.
 */

export const extensions = ['.ts', '.tsx', '.d.ts', '.cts', '.d.cts', '.mts', '.d.mts'];
