import { TCreateOption } from '@configs/interfaces/IOption';
import jsonLoader from '@configs/jsonLoader';
import minimist from 'minimist';

export default function getCliCreateOption(
  configBuf: Buffer,
  argv: minimist.ParsedArgs,
  configFilePath: string,
  project: string,
): TCreateOption {
  const rawConfig: Partial<TCreateOption> = jsonLoader(configBuf.toString());

  const option: TCreateOption = {
    mode: 'create',

    c: configFilePath,
    config: configFilePath,

    p: project,
    project,

    f: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename ?? 'index.ts',
    exportFilename: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename ?? 'index.ts',

    s: argv.s ?? argv.useSemicolon ?? rawConfig.useSemicolon,
    useSemicolon: argv.s ?? argv.useSemicolon ?? rawConfig.useSemicolon,

    m: argv.m ?? argv.useTimestamp ?? rawConfig.useTimestamp,
    useTimestamp: argv.m ?? argv.useTimestamp ?? rawConfig.useTimestamp,

    t: argv.t ?? argv.useComment ?? rawConfig.useComment,
    useComment: argv.t ?? argv.useComment ?? rawConfig.useComment,

    q: argv.q ?? argv.quote ?? rawConfig.quote,
    quote: argv.q ?? argv.quote ?? rawConfig.quote,

    b: argv.b ?? argv.useBackupFile ?? rawConfig.useBackupFile,
    useBackupFile: argv.b ?? argv.useBackupFile ?? rawConfig.useBackupFile,

    k: argv.b ?? argv.keepFileExt ?? rawConfig.keepFileExt,
    keepFileExt: argv.b ?? argv.keepFileExt ?? rawConfig.keepFileExt,

    e: argv.e ?? argv.skipEmptyDir ?? rawConfig.skipEmptyDir,
    skipEmptyDir: argv.r ?? argv.skipEmptyDir ?? rawConfig.skipEmptyDir,
  };

  return option;
}
