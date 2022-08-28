import { TRemoveOption } from '@configs/interfaces/IOption';
import jsonLoader from '@configs/jsonLoader';
import { getDirnameSync } from 'my-node-fp';
import { ArgumentsCamelCase } from 'yargs';

export default function getCliRemoveOption(
  configBuf: Buffer,
  argv: ArgumentsCamelCase<TRemoveOption>,
  configFilePath: string,
  project: string,
): TRemoveOption {
  const rawConfig: Partial<TRemoveOption> = jsonLoader(configBuf.toString());

  const option: TRemoveOption = {
    mode: 'remove',

    c: configFilePath,
    config: configFilePath,

    p: project,
    project,

    f: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename ?? 'index.ts',
    exportFilename: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename ?? 'index.ts',

    a: argv.a ?? argv.startAt ?? rawConfig.startAt ?? getDirnameSync(project),
    startAt: argv.a ?? argv.startAt ?? rawConfig.startAt ?? getDirnameSync(project),

    progressStream: argv.progressStream ?? rawConfig.progressStream ?? 'stdout',
    spinnerStream: argv.spinnerStream ?? rawConfig.spinnerStream ?? 'stdout',
    reasonerStream: argv.reasonerStream ?? rawConfig.reasonerStream ?? 'stderr',

    b: argv.b ?? argv.includeBackup ?? rawConfig.includeBackup,
    includeBackup: argv.b ?? argv.includeBackup ?? rawConfig.includeBackup,
  };

  return option;
}
