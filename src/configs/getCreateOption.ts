import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import { TCreateOption } from '@configs/interfaces/IOption';
import { getDirnameSync } from 'my-node-fp';
import { ArgumentsCamelCase } from 'yargs';

export default function getCreateOption(argv: ArgumentsCamelCase<TCreateOption>): TCreateOption {
  const projectDirPath = getDirnameSync(argv.p ?? argv.project);

  const option: ReturnType<typeof getCreateOption> = {
    ...argv,

    mode: 'create',

    a: argv.a ?? argv.startAt ?? projectDirPath,
    startAt: argv.a ?? argv.startAt ?? projectDirPath,

    g: argv.g ?? argv.ignoreFile ?? defaultIgnoreFileName,
    ignoreFile: argv.g ?? argv.ignoreFile ?? defaultIgnoreFileName,
  };

  return option;
}
