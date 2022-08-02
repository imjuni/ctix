import { TSingleOption } from '@configs/interfaces/IOption';
import jsonLoader from '@configs/jsonLoader';
import { ArgumentsCamelCase } from 'yargs';

export default function getCliSingleOption(
  configBuf: Buffer,
  argv: ArgumentsCamelCase<TSingleOption>,
  configFilePath: string,
  project: string,
): TSingleOption {
  const rawConfig: Partial<TSingleOption> = jsonLoader(configBuf.toString());

  const option: TSingleOption = {
    mode: 'single',

    c: configFilePath,
    config: configFilePath,

    p: project,
    project,

    f: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename ?? 'index.ts',
    exportFilename: argv.f ?? argv.exportFilename ?? rawConfig.exportFilename ?? 'index.ts',

    s: argv.s ?? argv.useSemicolon ?? rawConfig.useSemicolon,
    useSemicolon: argv.s ?? argv.useSemicolon ?? rawConfig.useSemicolon,

    t: argv.t ?? argv.useTimestamp ?? rawConfig.useTimestamp,
    useTimestamp: argv.t ?? argv.useTimestamp ?? rawConfig.useTimestamp,

    m: argv.m ?? argv.useComment ?? rawConfig.useComment,
    useComment: argv.m ?? argv.useComment ?? rawConfig.useComment,

    q: argv.q ?? argv.quote ?? rawConfig.quote,
    quote: argv.q ?? argv.quote ?? rawConfig.quote,

    w: argv.w ?? argv.overwrite ?? rawConfig.overwrite,
    overwrite: argv.w ?? argv.overwrite ?? rawConfig.overwrite,

    k: argv.k ?? argv.keepFileExt ?? rawConfig.keepFileExt,
    keepFileExt: argv.k ?? argv.keepFileExt ?? rawConfig.keepFileExt,

    r: argv.r ?? argv.useRootDir ?? rawConfig.useRootDir,
    useRootDir: argv.r ?? argv.useRootDir ?? rawConfig.useRootDir,

    o: argv.o ?? argv.output ?? rawConfig.output,
    output: argv.o ?? argv.output ?? rawConfig.output,
  };

  return option;
}
