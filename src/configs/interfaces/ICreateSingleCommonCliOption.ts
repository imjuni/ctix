export default interface ICreateSingleCommonCliOption {
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

  w?: boolean;
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
}
