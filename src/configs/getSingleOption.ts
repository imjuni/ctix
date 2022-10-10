import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import { TSingleOption } from '@configs/interfaces/IOption';
import { getDirnameSync } from 'my-node-fp';
import { ArgumentsCamelCase } from 'yargs';

export default function getSingleOption(argv: ArgumentsCamelCase<TSingleOption>): TSingleOption {
  const projectDirPath = getDirnameSync(argv.p ?? argv.project);

  const option: ReturnType<typeof getSingleOption> = {
    ...argv,

    mode: 'single',

    a: argv.a ?? argv.startAt ?? projectDirPath,
    startAt: argv.a ?? argv.startAt ?? projectDirPath,

    o: argv.o ?? argv.output ?? projectDirPath,
    output: argv.o ?? argv.output ?? projectDirPath,

    g: argv.g ?? argv.ignoreFile ?? defaultIgnoreFileName,
    ignoreFile: argv.g ?? argv.ignoreFile ?? defaultIgnoreFileName,
  };

  return option;
}
