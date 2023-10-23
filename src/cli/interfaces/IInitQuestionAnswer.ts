import type { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';

export interface IInitQuestionAnswer {
  cwd: string;
  tsconfig: string[];
  mode: CE_CTIX_BUILD_MODE;
  exportFilename: string;
}
