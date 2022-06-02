import {
  TCleanOption,
  TCreateOption,
  TInitOption,
  TSingleOption,
} from '@configs/interfaces/IOption';
import { Argv } from 'yargs';

export default function initBuilder<
  T extends TCleanOption | TCreateOption | TInitOption | TSingleOption,
>(args: Argv<T>) {
  args
    // remove only
    .option('includeBackup', {
      describe: 'clean with backup file',
      type: 'boolean',
    })
    // single only
    .option('useRootDir', {
      describe: 'output file under rootDir in tsconfig.json',
      type: 'boolean',
    })
    .option('output', {
      describe: 'output directory',
      type: 'string',
    })
    // create only
    .option('skipEmptyDir', {
      describe: 'If set true this option, skip empty directory',
      type: 'boolean',
    })
    // create, single common
    .option('useSemicolon', {
      describe: 'add semicolon on every export statement',
      type: 'boolean',
    })
    .option('useTimestamp', {
      describe:
        'timestamp write on ctix comment right-side, only works in useComment option set true',
      type: 'boolean',
    })
    .option('useComment', {
      describe:
        'add ctix comment at first line of creted index.ts file, that remark created from ctix',
      type: 'boolean',
    })
    .option('quote', {
      describe: 'change quote character at export syntax',
      type: 'string',
    })
    .option('useBackupFile', {
      describe: 'created backup file if exists index.ts file already in directory',
      type: 'boolean',
    })
    .option('keepFileExt', {
      describe: 'keep file extension in export statement path',
      type: 'boolean',
    });

  return args;
}
