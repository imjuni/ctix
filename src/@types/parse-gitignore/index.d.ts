declare module 'parse-gitignore' {
  function parse(fileContent: string): string[];
  export = parse;
}
