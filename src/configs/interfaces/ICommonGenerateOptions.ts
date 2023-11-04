import type { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import type { CE_GENERATION_STYLE } from '#/configs/const-enum/CE_GENERATION_STYLE';

export interface ICommonGenerateOptions {
  /**
   * tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
   * * only work root directory or cli parameter
   *
   * @required
   * @command build
   * @mode bundle, create
   */
  project: string;

  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
   *
   * @command build, remove
   * @mode bundle, create
   *
   * @default index.ts
   */
  exportFilename: string;

  /**
   * add ctix comment at first line of creted index.ts file, that remark created from ctix
   *
   * @command build
   * @mode bundle, create
   *
   * @default false
   */
  useSemicolon: boolean;

  /**
   * add ctix comment at first line of creted index.ts file, that remark created from ctix
   *
   * @command build
   * @mode bundle, create
   *
   * @default false
   */
  useBanner: boolean;

  /**
   * If specified as true, adds the created date to the top of the `index.ts` file,
   * this option only works if the `useBanner` option is enabled
   *
   * @command build
   * @mode bundle, create
   *
   * @default false
   */
  useTimestamp: boolean;

  /**
   * quote mark " or '
   *
   * @command build
   * @mode bundle, create
   *
   * @default '
   */
  quote: string;

  /**
   * `"use strict"`와 같은 문자열을 상단에 추가하기 위해서 사용합니다. banner보다 더 먼저 추가 됩니다
   * Use to add a literal like `"use strict"` to the top. It will be added before the banner.
   *
   * @command build
   * @mode bundle, create
   */
  directive: string;

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
   * overwrite each index.ts file
   *
   * @command build
   * @mode bundle, create
   *
   * @default false
   */
  overwrite: boolean;

  /**
   * Create a backup file if the `index.ts` file already exists.
   * This option only works if the `overwrite` option is enabled.
   *
   * @command build
   * @mode bundle, create
   *
   * @defulat true
   * */
  backup: boolean;

  /**
   * When generating the `index.ts` file, decide how you want to generate it
   *
   * @command build
   * @mode bundle, create
   *
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
   * @command build
   * @mode bundle, create
   */
  include: string[];

  /**
   * index.ts 파일을 생성할 때 제외할 파일의 목록입니다. 만약 아무런 값을 설정하지 않는다면
   * tsconfig.json 파일에 설정된 exclude 설정 값을 사용합니다
   *
   * A list of files to exclude when generating the index.ts file. If no value is set,
   * the value of the exclude setting set in the tsconfig.json file is used
   *
   * @command build
   * @mode bundle, create
   */
  exclude: string[];
}
