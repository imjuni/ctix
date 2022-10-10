import { TRemoveOption } from '@configs/interfaces/IOption';
import { getDirnameSync } from 'my-node-fp';
import { ArgumentsCamelCase } from 'yargs';

export default function getRemoveOption(argv: ArgumentsCamelCase<TRemoveOption>): TRemoveOption {
  const projectDirPath = getDirnameSync(argv.p ?? argv.project);

  const option: ReturnType<typeof getRemoveOption> = {
    ...argv,

    mode: 'remove',

    a: argv.a ?? argv.startAt ?? projectDirPath,
    startAt: argv.a ?? argv.startAt ?? projectDirPath,
  };

  return option;
}
