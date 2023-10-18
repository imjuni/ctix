import type {
  TCreateOption,
  TInitOption,
  TRemoveOption,
  TSingleOption,
} from '#/configs/interfaces/IOption';
import type { Argv } from 'yargs';

export function initBuilder<T extends TRemoveOption | TCreateOption | TInitOption | TSingleOption>(
  args: Argv<T>,
) {
  args
    // remove only
    .option('includeBackup', {
      describe: 'clean with backup file',
      type: 'boolean',
      default: true,
    })
    // single only
    .option('useRootDir', {
      describe: 'output file under rootDir in tsconfig.json',
      type: 'boolean',
      default: false,
    })
    .option('output', {
      describe: 'output directory',
      type: 'string',
    })
    // create only
    .option('skipEmptyDir', {
      describe: 'If set true this option, skip empty directory',
      type: 'boolean',
      default: true,
    })
    // create, single common
    .option('useSemicolon', {
      describe: 'add semicolon on every export statement',
      type: 'boolean',
      default: true,
    })
    .option('useTimestamp', {
      describe:
        'timestamp write on ctix comment right-side, only works in useComment option set true',
      type: 'boolean',
      default: false,
    })
    .option('useComment', {
      describe:
        'add ctix comment at first line of creted index.ts file, that remark created from ctix',
      type: 'boolean',
      default: false,
    })
    .option('quote', {
      describe: 'change quote character at export syntax',
      type: 'string',
      default: "'",
    })
    .option('useBackupFile', {
      describe: 'created backup file if exists index.ts file already in directory',
      type: 'boolean',
      default: true,
    })
    .option('keepFileExt', {
      describe: 'keep file extension in export statement path',
      type: 'boolean',
      default: false,
    });

  return args;
}
