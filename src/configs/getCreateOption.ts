import { defaultIgnoreFileName } from '#/configs/defaultIgnoreFileName';
import { getStartAtDir } from '#/configs/getStartAtDir';
import type { TCreateOption } from '#/configs/interfaces/IOption';
import { getDirnameSync, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import type { ArgumentsCamelCase } from 'yargs';

export function getCreateOption(argv: ArgumentsCamelCase<TCreateOption>): TCreateOption {
  const projectDirPath = replaceSepToPosix(path.resolve(getDirnameSync(argv.p ?? argv.project)));
  const startAt = getStartAtDir(argv.a ?? argv.startAt, projectDirPath);

  const option: ReturnType<typeof getCreateOption> = {
    ...argv,

    mode: 'create',

    a: startAt,
    startAt,

    g: argv.g ?? argv.ignoreFile ?? defaultIgnoreFileName,
    ignoreFile: argv.g ?? argv.ignoreFile ?? defaultIgnoreFileName,
  };

  return option;
}
