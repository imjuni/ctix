import type { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';

export interface IInitQuestionAnswer {
  cwd: string;
  tsconfig: string[];
  mode: CE_CTIX_BUILD_MODE;
  overwirte: boolean;
  packageJson: string;
  addEveryOptions: boolean;
  configComment: boolean;
  confirmBackupPackageTsconfig: boolean;
  configPosition: '.ctirc' | 'tsconfig.json' | 'package.json';
  exportFilename: string;
}
