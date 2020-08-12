import { Options } from 'yargs';
// import { ICTIXOptions } from '@interfaces/ICTIXOptions';

export const options = new Map<string, Options>([
  [
    'addnewline',
    {
      alias: 'n',
      describe: 'deside add newline file ending. no option true, option false',
      type: 'boolean',
    },
  ],
  [
    'usesemicolon',
    {
      alias: 's',
      describe: 'deside use semicolon line ending. no option true, option false',
      type: 'boolean',
    },
  ],
  [
    'usetimestamp',
    {
      alias: 't',
      // elint-disable-next-line
      describe: `deside use timestamp(YYYY-MM-DD HH:mm) top line comment. \nno option false, option true`,
      type: 'boolean',
    },
  ],
  [
    'withoutcomment',
    {
      alias: 'w',
      describe: 'remove comment from created file',
      type: 'boolean',
    },
  ],
  [
    'withoutbackup',
    {
      alias: 'b',
      describe: "Don't create backupfile if already exists target file",
      type: 'boolean',
    },
  ],
  [
    'verbose',
    {
      alias: 'v',
      describe: 'verbose logging message. to option false, option true',
      type: 'boolean',
    },
  ],
  [
    'quote',
    {
      alias: 'q',
      describe: "deside quote character. default quote character is '",
      type: 'string',
    },
  ],
  [
    'output',
    {
      alias: 'o',
      describe: 'set output filename. default index.ts or entrypoint.ts',
      type: 'string',
    },
  ],
  [
    'project',
    {
      alias: 'p',
      describe: 'project path: tsconfig.json path',
      type: 'string',
    },
  ],
]);
