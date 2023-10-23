export function getImportStatementRemoveExtname(extname: string): string {
  switch (extname) {
    // .js
    case '.ts':
      return '';

    // .jsx
    case '.tsx':
    case '.jsx':
      return '';

    // declaration file not change extension
    case '.d.ts':
    case '.d.cts':
    case '.d.mts':
      return extname;

    // .cjs
    case '.cts':
    case '.cjs':
      return '';

    // .mjs
    case '.mts':
    case '.mjs':
      return '';

    // other case: .js
    default:
      return '';
  }
}
