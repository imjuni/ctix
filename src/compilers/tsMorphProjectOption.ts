import * as tsm from 'ts-morph';

const tsMorphProjectOption: Readonly<tsm.ProjectOptions> = {
  skipAddingFilesFromTsConfig: false,
  skipFileDependencyResolution: true,
  skipLoadingLibFiles: true,
};

export default tsMorphProjectOption;
