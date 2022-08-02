import {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import { Argv } from 'yargs';

export default function createSingleBuilder<
  T extends TRemoveOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args
    .option('useSemicolon', {
      alias: 's',
      describe: 'add semicolon on every export statement',
      type: 'boolean',
      default: true,
    })
    .option('useTimestamp', {
      alias: 't',
      describe:
        'timestamp write on ctix comment right-side, only works in useComment option set true',
      type: 'boolean',
      default: false,
    })
    .option('useComment', {
      alias: 'm',
      describe:
        'add ctix comment at first line of creted index.ts file, that remark created from ctix',
      type: 'boolean',
      default: false,
    })
    .option('quote', {
      alias: 'q',
      describe: 'change quote character at export syntax',
      type: 'string',
      default: "'",
    })
    .option('overwrite', {
      alias: 'w',
      describe: 'overwrite each index.ts file',
      type: 'boolean',
      default: false,
    })
    .option('keepFileExt', {
      alias: 'k',
      describe: 'keep file extension in export statement path',
      type: 'boolean',
      default: false,
    })
    .option('ignoreFile', {
      alias: 'g',
      describe:
        'ignore file name. You can pass ignore, config file at ctix and use it like profile',
      type: 'string',
    });

  return args;
}
