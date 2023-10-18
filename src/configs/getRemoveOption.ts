import { getStartAtDir } from '#/configs/getStartAtDir';
import type { TRemoveOption } from '#/configs/interfaces/IOption';
import { getDirnameSync, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import type { ArgumentsCamelCase } from 'yargs';

export function getRemoveOption(argv: ArgumentsCamelCase<TRemoveOption>): TRemoveOption {
  const projectDirPath = replaceSepToPosix(path.resolve(getDirnameSync(argv.p ?? argv.project)));
  const startAt = getStartAtDir(argv.a ?? argv.startAt, projectDirPath);

  const option: ReturnType<typeof getRemoveOption> = {
    ...argv,

    mode: 'remove',

    a: startAt,
    startAt,
  };

  return option;
}
