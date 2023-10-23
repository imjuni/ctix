export const nestedOptionDefaultTemplate = `
{
  // build mode
  // - create: create an \`index.ts\` file in each directory
  // - bundle: bundle all export information in one \`index.ts\` file 
  "mode": "<%= it.mode %>",
  
  // tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
  // only work root directory or cli parameter
  // 
  // @mode all
  "project": "<%= it.project %>",
  
  // Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
  // 
  // @mode create, bundle, remove
  // @default index.ts
  "exportFilename": "<%= it.exportFilename %>",
  
  // add ctix comment at first line of creted index.ts file, that remark created from ctix
  //
  // @mode create, bundle
  // @default false
  "useSemicolon": <%= it.useSemicolon %>,
  
  // add ctix comment at first line of creted index.ts file, that remark created from ctix
  //
  // @mode create, bundle
  // @default false
  "useBanner": <%= it.useBanner %>,
  
  // If specified as true, adds the created date to the top of the \`index.ts\` file,
  // this option only works if the \`useBanner\` option is enabled
  //
  // @mode create, bundle
  // @default false
  "useTimestamp": <%= it.useTimestamp %>,
  
  // quote mark " or '
  // @mode create, bundle
  // 
  // @default '
  "quote": "<%= it.quote %>",

  // Use to add a literal like \`"use strict"\` to the top. It will be added before the banner.
  //
  // @mode create, bundle
  "directive": "<%= it.directive %>",

  // keep file extension in export statement path
  //
  // if this option set true that see below
  // export * from './test.ts'
  //
  // @mode create, bundle
  // @default none
  "fileExt": "<%= it.fileExt %>",

  // overwrite each index.ts file
  // @mode create, bundle
  // @default false
  "overwrite": <%= it.overwrite %>,

  // don't create backup file even if set overwrite option enable
  //
  // @mode create, bundle
  // @defulat true
  "noBackup": <%= it.noBackup %>,

  // When generating the \`index.ts\` file, decide how you want to generate it
  //
  // @mode create, bundle
  // @default auto
  "generationStyle": "<%= it.generationStyle %>",

  // A list of files to use when generating the index.ts file. If no value is set,
  // the value of the include setting set in the tsconfig.json file will be used
  //
  // @mode create, bundle
  "include": <%= it.include %>,

  // A list of files to exclude when generating the index.ts file. If no value is set,
  // the value of the exclude setting set in the tsconfig.json file is used
  //
  // @mode create, bundle
  "exclude": <%= it.exclude %>,

  // If \`skipEmptyDir\` is set to true, an empty directory with no files will not create an \`index.ts\` file
  //
  // @mode create
  // @default true 
  "skipEmptyDir": <%= it.skipEmptyDir %>,

  // Specify the starting directory to start creating the \`index.ts\` file
  //
  // @mode create
  // @default tsconfig.json file directory
  "startFrom": "<%= it.startFrom %>",

  // Output directory. Default value is same project directory
  // @mode bundle
  "output": "<%= it.output %>",

  // remove with backup file
  // @mode remove
  // @default false
  "removeBackup": <%= it.removeBackup %>,

  // answer \`yes\` to all questions
  // @mode remove
  // @default false
  "forceYes": <%= it.forceYes %>,
}
`;
