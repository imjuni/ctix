import { TCleanOption } from '@configs/interfaces/IOption';

export default function getRequiredCliCleanOption(
  originConfig: Partial<Omit<TCleanOption, 'config' | 'c' | 'project' | 'p'>> &
    Required<Pick<TCleanOption, 'config' | 'c' | 'project' | 'p'>>,
): TCleanOption {
  const option: TCleanOption = {
    mode: 'clean',

    c: originConfig.c,
    config: originConfig.config,

    p: originConfig.p,
    project: originConfig.project,

    f: originConfig.exportFilename ?? 'index.ts',
    exportFilename: originConfig.exportFilename ?? 'index.ts',

    v: originConfig.verbose ?? false,
    verbose: originConfig.verbose ?? false,

    b: originConfig.includeBackup ?? false,
    includeBackup: originConfig.includeBackup ?? false,
  };

  return option;
}
