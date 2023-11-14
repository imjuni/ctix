# build command, bundle mode option

| Property          | Type                      | Default                                    | Required | Description                                                                                                                                                          | Command           | Mode                         |
| ----------------- | ------------------------- | ------------------------------------------ | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------- |
| `config`          | `string`                  |                                            |   Yes    | Configuration file (.ctirc) path.                                                                                                                                    | `build`, `remove` | `bundle`, `create`, `module` |
| `spinnerStream`   | `TStreamType`             | `stdout`                                   |    No    | Stream of CLI spinner. Options are `stdout` or `stderr`.                                                                                                             | `build`, `remove` | `bundle`, `create`, `module` |
| `progressStream`  | `TStreamType`             | `stdout`                                   |    No    | Stream of CLI progress. Options are `stdout` or `stderr`.                                                                                                            | `build`, `remove` | `bundle`, `create`, `module` |
| `reasonerStream`  | `TStreamType`             | `stderr`                                   |    No    | Stream of CLI reasoner, showing name conflict errors and already existing `index.ts` file errors.                                                                    | `build`, `remove` | `bundle`, `create`, `module` |
| `exportFilename`  | `string`                  | `index.ts`                                 |    No    | Export filename, defaults to "index.ts" or "index.d.ts" if not provided.                                                                                             | `build`, `remove` | `bundle`, `create`, `module` |
| `project`         | `string`                  |                                            |   Yes    | tsconfig.json path (must include the filename, like "./tsconfig.json"). Works only in root directory or via CLI parameter.                                           | `build`           | `bundle`, `create`, `module` |
| `useSemicolon`    | `boolean`                 | `false`                                    |    No    | Whether to add a semicolon at the end of lines in the generated `index.ts` file.                                                                                     | `build`           | `bundle`, `create`, `module` |
| `useBanner`       | `boolean`                 | `false`                                    |    No    | Whether to add a ctix comment at the first line of the created `index.ts` file, indicating it was generated by ctix.                                                 | `build`           | `bundle`, `create`, `module` |
| `useTimestamp`    | `boolean`                 | `false`                                    |    No    | Adds the creation date to the top of the `index.ts` file if `useBanner` is true.                                                                                     | `build`           | `bundle`, `create`, `module` |
| `quote`           | `string`                  | `'`                                        |    No    | The quote mark to use for strings (" or ').                                                                                                                          | `build`           | `bundle`, `create`, `module` |
| `directive`       | `string`                  |                                            |    No    | A literal like `"use strict"` to be added to the top of the file, before the banner.                                                                                 | `build`           | `bundle`, `create`, `module` |
| `fileExt`         | `CE_EXTENSION_PROCESSING` | `none`                                     |    No    | Whether to keep the file extension in the export statement path (e.g., `export * from './test.ts'`).                                                                 | `build`           | `bundle`, `create`, `module` |
| `overwrite`       | `boolean`                 | `false`                                    |    No    | Whether to overwrite each `index.ts` file.                                                                                                                           | `build`           | `bundle`, `create`, `module` |
| `backup`          | `boolean`                 | `true`                                     |    No    | Create a backup file if the `index.ts` file already exists, but only if `overwrite` is true (Note: there is a typo in the source as "defulat", should be "default"). | `build`           | `bundle`, `create`, `module` |
| `generationStyle` | `CE_GENERATION_STYLE`     | `auto`                                     |    No    | The style to use when generating the `index.ts` file.                                                                                                                | `build`           | `bundle`, `create`, `module` |
| `include`         | `string[]`                |                                            |    No    | List of files to include when generating the `index.ts` file, defaults to tsconfig.json `include` value if not set.                                                  | `build`           | `bundle`, `create`, `module` |
| `exclude`         | `string[]`                |                                            |    No    | List of files to exclude when generating the `index.ts` file, defaults to tsconfig.json `exclude` value if not set.                                                  | `build`           | `bundle`, `create`, `module` |
| `output`          | `string`                  | Default value is same as project directory |    No    | Output directory for the build command.                                                                                                                              | `build`           | `bundle`, `module`           |

**Note:** `TStreamType` is a TypeScript type derived from the properties of the Node.js `process` object, specifically extracting the `stdout` and `stderr` streams.