export default interface IOnlySingleCliOption {
  mode: 'single';

  /**
   * Output directory. Default value is same project directory
   * @mode single
   */
  o: string;
  output: string;

  /**
   * Only work single file generation mode. use rootDir configuration in tsconfig.json.
   * Export file create under a rootDir directory. If you set rootDirs, ctix use first element of array.
   * @mode single
   * @default false
   */
  r?: boolean;
  useRootDir?: boolean;

  /**
   * index.ts file exclude only in output directory
   *
   * @mode single
   * @default false
   */
  excludeOnlyOutput?: boolean;
}
