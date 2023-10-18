export interface ICreateSingleCommonCliOption {
  /**
   * add ctix comment at first line of creted index.ts file, that remark created from ctix
   * @mode create, single
   * @default false
   */
  s?: boolean;
  /**
   * add ctix comment at first line of creted index.ts file, that remark created from ctix
   * @mode create, single
   * @default false
   */
  useSemicolon?: boolean;

  /**
   * timestamp write on ctix comment right-side, only works in useComment option set true
   * @mode create, single
   * @default false
   */
  t?: boolean;
  /**
   * timestamp write on ctix comment right-side, only works in useComment option set true
   * @mode create, single
   * @default false
   */
  useTimestamp?: boolean;

  /**
   * add ctix comment at first line of creted index.ts file, that remark created from ctix
   * @mode create, single
   * @default false
   */
  m?: boolean;
  /**
   * add ctix comment at first line of creted index.ts file, that remark created from ctix
   * @mode create, single
   * @default false
   */
  useComment?: boolean;

  /**
   * quote mark " or '
   * @mode create, single
   * @default '
   */
  q?: string;
  /**
   * quote mark " or '
   * @mode create, single
   * @default '
   */
  quote?: string;

  /**
   * overwrite each index.ts file
   * @mode create, single
   * @default false
   */
  w?: boolean;
  /**
   * overwrite each index.ts file
   * @mode create, single
   * @default false
   */
  overwrite?: boolean;

  /**
   * Keep file extension in index.ts file.
   *
   * if this option set true that see below
   * export * from './test.ts'
   *
   * @mode create, single
   * @default false
   */
  k?: boolean;
  /**
   * keep file extension in export statement path
   *
   * if this option set true that see below
   * export * from './test.ts'
   *
   * @mode create, single
   * @default false
   */
  keepFileExt?: boolean;

  /**
   * ignore file name. You can pass ignore, config file at ctix and use it like profile
   *
   * @mode create, single
   * @default .ctiignore
   */
  g: string;
  ignoreFile: string;

  /**
   * not create backup file even if set overwrite option enable
   *
   * @mode create, single
   * @defulat false
   * */
  noBackup: boolean;
}
