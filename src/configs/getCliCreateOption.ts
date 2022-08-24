import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import { TCreateOption } from '@configs/interfaces/IOption';
import jsonLoader from '@configs/jsonLoader';
import { ArgumentsCamelCase } from 'yargs';

export default function getCliCreateOption(
  configBuf: Buffer,
  argv: ArgumentsCamelCase<TCreateOption>,
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

    progressStream: argv.progressStream ?? rawConfig.progressStream ?? 'stdout',
    spinnerStream: argv.spinnerStream ?? rawConfig.spinnerStream ?? 'stdout',
    reasonerStream: argv.reasonerStream ?? rawConfig.reasonerStream ?? 'stderr',

    s: argv.s ?? argv.useSemicolon ?? rawConfig.useSemicolon,
    useSemicolon: argv.s ?? argv.useSemicolon ?? rawConfig.useSemicolon,

    m: argv.m ?? argv.useTimestamp ?? rawConfig.useTimestamp,
    useTimestamp: argv.m ?? argv.useTimestamp ?? rawConfig.useTimestamp,

    t: argv.t ?? argv.useComment ?? rawConfig.useComment,
    useComment: argv.t ?? argv.useComment ?? rawConfig.useComment,

    q: argv.q ?? argv.quote ?? rawConfig.quote,
    quote: argv.q ?? argv.quote ?? rawConfig.quote,

    w: argv.w ?? argv.overwrite ?? rawConfig.overwrite,
    overwrite: argv.w ?? argv.overwrite ?? rawConfig.overwrite,

    k: argv.k ?? argv.keepFileExt ?? rawConfig.keepFileExt,
    keepFileExt: argv.k ?? argv.keepFileExt ?? rawConfig.keepFileExt,

    e: argv.e ?? argv.skipEmptyDir ?? rawConfig.skipEmptyDir,
    skipEmptyDir: argv.e ?? argv.skipEmptyDir ?? rawConfig.skipEmptyDir,

    g: argv.g ?? argv.ignoreFile ?? rawConfig.ignoreFile ?? defaultIgnoreFileName,
    ignoreFile: argv.g ?? argv.ignoreFile ?? rawConfig.ignoreFile ?? defaultIgnoreFileName,
  };

  return option;
}
