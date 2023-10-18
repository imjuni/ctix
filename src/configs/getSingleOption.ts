import { defaultIgnoreFileName } from '#/configs/defaultIgnoreFileName';
import { getStartAtDir } from '#/configs/getStartAtDir';
import type { TSingleOption } from '#/configs/interfaces/IOption';
import { getDirnameSync, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import type { ArgumentsCamelCase } from 'yargs';

export function getSingleOption(argv: ArgumentsCamelCase<TSingleOption>): TSingleOption {
  const projectDirPath = replaceSepToPosix(path.resolve(getDirnameSync(argv.p ?? argv.project)));
  const startAt = getStartAtDir(argv.a ?? argv.startAt, projectDirPath);

  const option: ReturnType<typeof getSingleOption> = {
    ...argv,

    mode: 'single',

    o: argv.o ?? argv.output ?? projectDirPath,
    output: argv.o ?? argv.output ?? projectDirPath,

    a: startAt,
    startAt,

    g: argv.g ?? argv.ignoreFile ?? defaultIgnoreFileName,
    ignoreFile: argv.g ?? argv.ignoreFile ?? defaultIgnoreFileName,
  };

  return option;
}
