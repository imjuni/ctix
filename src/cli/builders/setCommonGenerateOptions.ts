import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';
import type { ICommonGenerateOptions } from '#/configs/interfaces/ICommonGenerateOptions';
import type { ICommonTsGenerateOptions } from '#/configs/interfaces/ICommonTsGenerateOptions';
import type { Argv } from 'yargs';

export function setCommonGenerateOptions<
  T = Argv<ICommonGenerateOptions & ICommonTsGenerateOptions>,
>(args: Argv<ICommonGenerateOptions & ICommonTsGenerateOptions>) {
  args
    .option('project', {
      alias: 'p',
      describe: 'tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"',
      type: 'string',
    })
    .option('mode', {
      describe: [
        'The mode in which the `index.ts` file is to be generated. There is a create mode that',
        'generates an `index.ts` file per directory, a bundle mode that generates a single `index.ts` file,',
        'and a module mode that generates an `index.ts` file by filename for `vue`, `sevelte`, etc.',
      ].join(''),
      type: 'string',
      choices: [
        CE_CTIX_BUILD_MODE.BUNDLE_MODE,
        CE_CTIX_BUILD_MODE.CREATE_MODE,
        CE_CTIX_BUILD_MODE.MODULE_MODE,
      ],
    })
    .option('export-filename', {
      alias: 'f',
      describe: 'Export filename, if you not pass this field that use "index.ts" or "index.d.ts"',
      type: 'string',
      default: CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
    })
    .option('use-semicolon', {
      describe: 'add semicolon on every export statement',
      type: 'boolean',
    })
    .option('use-banner', {
      describe:
        'add ctix comment at first line of creted index.ts file, that remark created from ctix',
      type: 'boolean',
    })
    .option('quote', {
      alias: 'q',
      describe: 'change quote character at export syntax',
      type: 'string',
    })
    .option('directive', {
      describe:
        'Use to add a literal like `"use strict"` to the top. It will be added before the banner.',
      type: 'string',
    })
    .option('file-ext', {
      describe: 'keep file extension in export statement path',
      type: 'string',
      choices: [
        CE_EXTENSION_PROCESSING.NOT_EXTENSION,
        CE_EXTENSION_PROCESSING.REPLACE_JS,
        CE_EXTENSION_PROCESSING.KEEP_EXTENSION,
      ],
    })
    .option('overwrite', {
      alias: 'w',
      describe: 'overwrite each index.ts file',
      type: 'boolean',
    })
    .option('backup', {
      describe: [
        'create a backup file if the `index.ts` file already exists.',
        'This option only works if the `overwrite` option is enabled',
      ].join(' '),
      type: 'boolean',
    })
    .option('generation-style', {
      describe: 'When generating the `index.ts` file, decide how you want to generate it',
      type: 'string',
      choices: [
        CE_GENERATION_STYLE.AUTO,
        CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_DESTRUCTIVE,
        CE_GENERATION_STYLE.DEFAULT_ALIAS_NAMED_STAR,
        CE_GENERATION_STYLE.DEFAULT_NON_ALIAS_NAMED_DESTRUCTIVE,
        CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_DESTRUCTIVE,
        CE_GENERATION_STYLE.DEFAULT_STAR_NAMED_STAR,
      ],
    })
    .option('include-files', {
      describe: [
        'A list of files to exclude when generating the index.ts file. If no value is set,',
        'the value of the exclude setting set in the tsconfig.json file is used',
      ].join(' '),
      type: 'string',
    })
    .option('exclude-files', {
      describe: [
        'A list of files to exclude when generating the index.ts file. If no value is set,',
        'the value of the exclude setting set in the tsconfig.json file is used',
      ].join(' '),
      type: 'string',
    });

  return args as T;
}
