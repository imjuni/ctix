export const nestedOptionDefaultTemplate = `
{
  <%- if (it.isComment && it.options.mode != null) { -%>
  // build mode
  // - create: create an \`index.ts\` file in each directory
  // - bundle: bundle all export information in one \`index.ts\` file
  <%- } -%>
  <%- if (it.options.mode != null) { -%>
  "mode": "<%= it.options.mode %>",
  <%- } -%>
  
  <%- if (it.isComment && it.options.project != null) { -%>
  // tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
  // only work root directory or cli parameter
  // 
  // @mode all
  <%- } -%>
  <%- if (it.options.project != null) { -%>
  "project": "<%= it.options.project %>",
  <%- } -%>
  
  <%- if (it.isComment && it.options.exportFilename != null) { -%>
  // Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
  // 
  // @mode create, bundle, remove
  // @default index.ts
  <%- } -%>
  <%- if (it.options.exportFilename != null) { -%>
  "exportFilename": "<%= it.options.exportFilename %>",
  <%- } -%>
  
  <%- if (it.addEveryOptions && it.isComment && it.options.useSemicolon != null) { -%>
  // add ctix comment at first line of creted index.ts file, that remark created from ctix
  //
  // @mode create, bundle
  // @default false
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.useSemicolon != null) { -%>
  "useSemicolon": <%= it.options.useSemicolon %>,
  <%- } -%>
  
  <%- if (it.addEveryOptions && it.isComment && it.options.useBanner != null) { -%>
  // add ctix comment at first line of creted index.ts file, that remark created from ctix
  //
  // @mode create, bundle
  // @default false
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.useBanner != null) { -%>
  "useBanner": <%= it.options.useBanner %>,
  <%- } -%>
  
  <%- if (it.addEveryOptions && it.isComment && it.options.useTimestamp != null) { -%>
  // If specified as true, adds the created date to the top of the \`index.ts\` file,
  // this option only works if the \`useBanner\` option is enabled
  //
  // @mode create, bundle
  // @default false
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.useTimestamp != null) { -%>
  "useTimestamp": <%= it.options.useTimestamp %>,
  <%- } -%>
  
  <%- if (it.addEveryOptions && it.isComment && it.options.quote != null) { -%>
  // quote mark " or '
  // @mode create, bundle
  // 
  // @default '
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.quote != null) { -%>
  "quote": "<%= it.options.quote %>",
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.directive != null) { -%>
  // Use to add a literal like \`"use strict"\` to the top. It will be added before the banner.
  //
  // @mode create, bundle
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.directive != null) { -%>
  "directive": "<%= it.options.directive %>",
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.fileExt != null) { -%>
  // keep file extension in export statement path
  //
  // if this option set true that see below
  // export * from './test.ts'
  //
  // @mode create, bundle
  // @default none
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.fileExt != null) { -%>
  "fileExt": "<%= it.options.fileExt %>",
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.overwrite != null) { -%>
  // overwrite each index.ts file
  // @mode create, bundle
  // @default false
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.overwrite != null) { -%>
  "overwrite": <%= it.options.overwrite %>,
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.backup != null) { -%>
  // Create a backup file if the \`index.ts\` file already exists. 
  // This option only works if the \`overwrite\` option is enabled.
  //
  // @mode create, bundle
  // @defulat true
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.backup != null) { -%>
  "backup": <%= it.options.backup %>,
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.generationStyle != null) { -%>
  // When generating the \`index.ts\` file, decide how you want to generate it
  //
  // @mode create, bundle
  // @default auto
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.generationStyle != null) { -%>
  "generationStyle": "<%= it.options.generationStyle %>",
  <%- } -%>

  <%- if (it.isComment && it.options.include != null) { -%>
  // A list of files to use when generating the index.ts file. If no value is set,
  // the value of the include setting set in the tsconfig.json file will be used
  //
  // @mode create, bundle
  <%- } -%>
  <%- if (it.options.include != null) { -%>
  "include": <%= it.options.include %>,
  <%- } -%>

  <%- if (it.isComment && it.options.exclude != null) { -%>
  // A list of files to exclude when generating the index.ts file. If no value is set,
  // the value of the exclude setting set in the tsconfig.json file is used
  //
  // @mode create, bundle
  <%- } -%>
  <%- if (it.options.exclude != null) { -%>
  "exclude": <%= it.options.exclude %>,
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.skipEmptyDir != null) { -%>
  // If \`skipEmptyDir\` is set to true, an empty directory with no files will not create an \`index.ts\` file
  //
  // @mode create
  // @default true
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.skipEmptyDir != null) { -%>
  "skipEmptyDir": <%= it.options.skipEmptyDir %>,
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.startFrom != null) { -%>
  // Specify the starting directory to start creating the \`index.ts\` file
  //
  // @mode create
  // @default tsconfig.json file directory
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.startFrom != null) { -%>
  "startFrom": <%= it.options.startFrom %>,
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.output != null) { -%>
  // Output directory. Default value is same project directory
  // @mode bundle
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.output != null) { -%>
  "output": "<%= it.options.output %>",
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.removeBackup != null) { -%>
  // remove with backup file
  // @mode remove
  // @default false
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.removeBackup != null) { -%>
  "removeBackup": <%= it.options.removeBackup %>,
  <%- } -%>

  <%- if (it.addEveryOptions && it.isComment && it.options.forceYes != null) { -%>
  // answer \`yes\` to all questions
  // @mode remove
  // @default false
  <%- } -%>
  <%- if (it.addEveryOptions && it.options.forceYes != null) { -%>
  "forceYes": <%= it.options.forceYes %>,
  <%- } -%>
}
`;
