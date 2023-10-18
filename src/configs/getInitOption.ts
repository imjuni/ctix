import { getStartAtDir } from '#/configs/getStartAtDir';
import type { TInitOption } from '#/configs/interfaces/IOption';
import { getDirnameSync, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import type { ArgumentsCamelCase } from 'yargs';

export function getInitOption(argv: ArgumentsCamelCase<TInitOption>): TInitOption {
  const projectDirPath = replaceSepToPosix(path.resolve(getDirnameSync(argv.p ?? argv.project)));
  const startAt = getStartAtDir(argv.a ?? argv.startAt, projectDirPath);

  const option: ReturnType<typeof getInitOption> = {
    ...argv,

    mode: 'init',

    a: startAt,
    startAt,
  };

  return option;
}
