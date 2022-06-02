import { TCreateOption } from '@configs/interfaces/IOption';

export default function getRequiredCliCreateOption(
  originConfig: Partial<Omit<TCreateOption, 'config' | 'c' | 'project' | 'p'>> &
    Required<Pick<TCreateOption, 'config' | 'c' | 'project' | 'p'>>,
): TCreateOption {
  const option: TCreateOption = {
    mode: 'create',

    c: originConfig.c,
    config: originConfig.config,

    p: originConfig.p,
    project: originConfig.project,

    f: originConfig.exportFilename ?? 'index.ts',
    exportFilename: originConfig.exportFilename ?? 'index.ts',

    v: originConfig.verbose ?? false,
    verbose: originConfig.verbose ?? false,

    s: originConfig.useSemicolon ?? true,
    useSemicolon: originConfig.useSemicolon ?? true,

    m: originConfig.useTimestamp ?? false,
    useTimestamp: originConfig.useTimestamp ?? false,

    t: originConfig.useComment ?? false,
    useComment: originConfig.useComment ?? false,

    q: originConfig.quote ?? "'",
    quote: originConfig.quote ?? "'",

    b: originConfig.useBackupFile ?? false,
    useBackupFile: originConfig.useBackupFile ?? false,

    k: originConfig.keepFileExt ?? false,
    keepFileExt: originConfig.keepFileExt ?? false,

    e: originConfig.skipEmptyDir ?? false,
    skipEmptyDir: originConfig.skipEmptyDir ?? false,
  };

  return option;
}
