import type { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import type { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';

export interface ICommonGenerateOptions {
  /**
   * tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
   * * only work root directory or cli parameter
   * @mode all
   */
  project: string;

  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
   * @mode create, bundle, remove
   * @default index.ts
   */
  exportFilename: string;

  /**
   * add ctix comment at first line of creted index.ts file, that remark created from ctix
   *
   * @mode create, bundle
   * @default false
   */
  useSemicolon: boolean;

  /**
   * add ctix comment at first line of creted index.ts file, that remark created from ctix
   *
   * @mode create, bundle
   * @default false
   */
  useBanner: boolean;

  /**
   * If specified as true, adds the created date to the top of the `index.ts` file,
   * this option only works if the `useBanner` option is enabled
   *
   * @mode create, bundle
   * @default false
   */
  useTimestamp: boolean;

  /**
   * quote mark " or '
   * @mode create, bundle
   * @default '
   */
  quote: string;

  /**
   * `"use strict"`와 같은 문자열을 상단에 추가하기 위해서 사용합니다. banner보다 더 먼저 추가 됩니다
   * Use to add a literal like `"use strict"` to the top. It will be added before the banner.
   *
   * @mode create, bundle
   */
  directive: string;

  /**
   * keep file extension in export statement path
   *
   * if this option set true that see below
   * export * from './test.ts'
   *
   * @mode create, bundle
   * @default none
   */
  fileExt: CE_EXTENSION_PROCESSING;

  /**
   * overwrite each index.ts file
   * @mode create, bundle
   * @default false
   */
  overwrite: boolean;

  /**
   * don't create backup file even if set overwrite option enable
   *
   * @mode create, bundle
   * @defulat true
   * */
  noBackup: boolean;

  /**
   * When generating the `index.ts` file, decide how you want to generate it
   *
   * @mode create, bundle
   * @default auto
   */
  generationStyle: CE_GENERATION_STYLE;

  /**
   * index.ts 파일을 생성할 때 사용할 파일의 목록입니다. 만약 아무런 값을 설정하지 않는다면
   * tsconfig.json 파일에 설정된 include 설정 값을 사용합니다
   *
   * A list of files to use when generating the index.ts file. If no value is set,
   * the value of the include setting set in the tsconfig.json file will be used
   *
   * @mode create, bundle
   */
  include: string[];

  /**
   * index.ts 파일을 생성할 때 제외할 파일의 목록입니다. 만약 아무런 값을 설정하지 않는다면
   * tsconfig.json 파일에 설정된 exclude 설정 값을 사용합니다
   *
   * A list of files to exclude when generating the index.ts file. If no value is set,
   * the value of the exclude setting set in the tsconfig.json file is used
   *
   * @mode create, bundle
   */
  exclude: string[];
}
