/**
 * build mode
 *
 * `index.ts` 파일을 생성할 모드입니다. 디렉토리 마다 `index.ts` 파일을 생성하는 create, 하나의 `index.ts` 파일을
 * 생성하는 bundle, vue, sevelte 등을 위해 파일 이름으로 `index.ts` 파일을 생성하는 module 모드가 있습니다
 *
 * The mode in which the `index.ts` file is to be generated. There is a create mode that
 * generates an `index.ts` file per directory, a bundle mode that generates a single `index.ts` file,
 * and a module mode that generates an `index.ts` file by filename for `vue`, `sevelte`, etc.
 *
 * - create: create an `index.ts` file in each directory
 * - bundle: bundle all export information in one `index.ts` file
 * - module: create an `index.ts` file using the module filename
 */
export const CE_CTIX_BUILD_MODE = {
  CREATE_MODE: 'create',
  BUNDLE_MODE: 'bundle',
  MODULE_MODE: 'module',
} as const;

export type CE_CTIX_BUILD_MODE = (typeof CE_CTIX_BUILD_MODE)[keyof typeof CE_CTIX_BUILD_MODE];
