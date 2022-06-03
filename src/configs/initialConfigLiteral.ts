const initialConfigLiteral = `{
  // common configuration
  // tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
  "project": "",
  
  // Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
  "exportFilename": "index.ts",


  // create, single command configuration
  // add ctix comment at first line of creted index.ts file, that remark created from ctix
  "useSemicolon": true,

  // timestamp write on ctix comment right-side, only works in useComment option set true
  "useTimestamp": false,
  
  // add ctix comment at first line of creted index.ts file, that remark created from ctix
  "useComment": false,

  // quote mark " or '
  "quote": "'",
  // overwrite index.ts file also index.ts file already exist that create backup file
  "overwrite": false,
  // keep file extension in export statement path
  "keepFileExt": false,

  
  // only create command configuration
  // If set true this option, skip empty directory
  "skipEmptyDir": true,


  // only single command configuration
  // Output directory. It works only single mode.
  "output": "",
  // Use rootDir or rootDirs configuration in tsconfig.json.
  "useRootDir": true,

  // only remove command configuration
  // remove with backup file
  "includeBackup": true
}`;

export default initialConfigLiteral;
