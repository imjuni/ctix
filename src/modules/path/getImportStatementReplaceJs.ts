export function getImportStatementReplaceJs(extname: string): string {
  switch (extname) {
    // .js
    case '.ts':
      return '.js';

    // .jsx
    case '.tsx':
    case '.jsx':
      return '.jsx';

    // declaration file not change extension
    case '.d.ts':
    case '.d.cts':
    case '.d.mts':
      return extname;

    // .cjs
    case '.cts':
    case '.cjs':
      return '.cjs';

    // .mjs
    case '.mts':
    case '.mjs':
      return '.mjs';

    // other case
    default:
      return extname;
  }
}
