import type * as tsm from 'ts-morph';

export const tsMorphProjectOption: Readonly<tsm.ProjectOptions> = {
  skipAddingFilesFromTsConfig: false,
  skipFileDependencyResolution: true,
  skipLoadingLibFiles: true,
};
