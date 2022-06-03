import { TRemoveOption } from '@configs/interfaces/IOption';

export default function getRequiredCliCleanOption(
  originConfig: Partial<Omit<TRemoveOption, 'config' | 'c' | 'project' | 'p'>> &
    Required<Pick<TRemoveOption, 'config' | 'c' | 'project' | 'p'>>,
): TRemoveOption {
  const option: TRemoveOption = {
    mode: 'clean',

    c: originConfig.c,
    config: originConfig.config,

    p: originConfig.p,
    project: originConfig.project,

    f: originConfig.exportFilename ?? 'index.ts',
    exportFilename: originConfig.exportFilename ?? 'index.ts',

    b: originConfig.includeBackup ?? false,
    includeBackup: originConfig.includeBackup ?? false,
  };

  return option;
}
