import { TSingleOption } from '@configs/interfaces/IOption';

export default function getRequiredCliSingleOption(
  originConfig: Partial<Omit<TSingleOption, 'config' | 'c' | 'project' | 'p'>> &
    Required<Pick<TSingleOption, 'config' | 'c' | 'project' | 'p'>>,
): TSingleOption {
  const option: TSingleOption = {
    mode: 'single',

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

    r: originConfig.useRootDir ?? false,
    useRootDir: originConfig.useRootDir ?? false,

    o: originConfig.output ?? originConfig.project,
    output: originConfig.output ?? originConfig.project,
  };

  return option;
}
