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

    f: originConfig.f ?? originConfig.exportFilename ?? 'index.ts',
    exportFilename: originConfig.f ?? originConfig.exportFilename ?? 'index.ts',

    s: originConfig.s ?? originConfig.useSemicolon ?? true,
    useSemicolon: originConfig.s ?? originConfig.useSemicolon ?? true,

    m: originConfig.m ?? originConfig.useTimestamp ?? false,
    useTimestamp: originConfig.m ?? originConfig.useTimestamp ?? false,

    t: originConfig.t ?? originConfig.useComment ?? false,
    useComment: originConfig.t ?? originConfig.useComment ?? false,

    q: originConfig.q ?? originConfig.quote ?? "'",
    quote: originConfig.q ?? originConfig.quote ?? "'",

    w: originConfig.w ?? originConfig.overwrite ?? false,
    overwrite: originConfig.w ?? originConfig.overwrite ?? false,

    k: originConfig.k ?? originConfig.keepFileExt ?? false,
    keepFileExt: originConfig.k ?? originConfig.keepFileExt ?? false,

    r: originConfig.r ?? originConfig.useRootDir ?? false,
    useRootDir: originConfig.r ?? originConfig.useRootDir ?? false,

    o: originConfig.o ?? originConfig.output ?? originConfig.project,
    output: originConfig.o ?? originConfig.output ?? originConfig.project,
  };

  return option;
}
