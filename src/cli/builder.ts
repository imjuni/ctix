import ICliOption from '@configs/interfaces/ICliOption';
import { Argv } from 'yargs';

export default function builder(args: Argv<ICliOption>) {
  args
    .option('config', {
      alias: 'c',
      describe: 'configuration file path',
      type: 'string',
    })
    .option('addNewline', {
      alias: 'n',
      describe: 'add newline on EOF',
      type: 'boolean',
    })
    .option('useSemicolon', {
      alias: 's',
      describe: 'add semicolon on every export statement',
      type: 'boolean',
    })
    .option('useTimestamp', {
      alias: 'm',
      describe:
        'timestamp write on ctix comment right-side, only works in useComment option set true',
      type: 'boolean',
    })
    .option('useComment', {
      alias: 'c',
      describe:
        'add ctix comment at first line of creted index.ts file, that remark created from ctix',
      type: 'boolean',
    })
    .option('quote', {
      alias: 'q',
      describe: 'change quote character at export syntax',
      type: 'string',
    })
    .option('excludePath', {
      alias: 'x',
      describe: 'exclude path in default export variable(or function)',
      type: 'boolean',
      default: false,
    })
    .option('useUpperFirst', {
      describe: 'Default export variable, class, function name keep first capital character.',
      type: 'boolean',
      default: true,
    })
    .option('useBackupFile', {
      alias: 'b',
      describe: 'created backup file if exists index.ts file already in directory',
      type: 'boolean',
    });

  return args;
}
