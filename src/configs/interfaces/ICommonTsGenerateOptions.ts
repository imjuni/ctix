import type { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import type { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';

export interface ICommonTsGenerateOptions {
  /**
   * keep file extension in export statement path
   *
   * if this option set true that see below
   * `export * from './test.ts'`
   *
   * @command build
   * @mode bundle, create
   *
   * @default none
   */
  fileExt: CE_EXTENSION_PROCESSING;

  /**
   * When generating the `index.ts` file, decide how you want to generate it
   *
   * @command build
   * @mode bundle, create
   *
   * @default auto
   */
  generationStyle: CE_GENERATION_STYLE;
}
