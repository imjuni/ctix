import { TCleanOption } from '@configs/interfaces/IOption';
import jsonLoader from '@configs/jsonLoader';
import minimist from 'minimist';

export default function getCliCleanOption(
  configBuf: Buffer,
  argv: minimist.ParsedArgs,
  configFilePath: string,
  project: string,
): TCleanOption {
  const rawConfig: Partial<TCleanOption> = jsonLoader(configBuf.toString());

  const option: TCleanOption = {
    mode: 'clean',

    c: configFilePath,
    config: configFilePath,

    p: project,
    project,

    f: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename ?? 'index.ts',
    exportFilename: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename ?? 'index.ts',

    b: argv.b ?? argv.includeBackup ?? rawConfig.includeBackup,
    includeBackup: argv.b ?? argv.includeBackup ?? rawConfig.includeBackup,
  };

  return option;
}
