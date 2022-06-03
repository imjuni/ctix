export default interface ICommonCliOption {
  /**
   * configuration file(.ctirc) path
   */
  c: string;
  /**
   * configuration file(.ctirc) path
   */
  config: string;

  /**
   * tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
   * * only work root directory or cli parameter
   * @mode all
   */
  p: string;
  /**
   * tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
   * * only work root directory or cli parameter
   * @mode all
   */
  project: string;

  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
   * @mode create, single, clean
   * @default index.ts
   */
  f: string;
  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
   * @mode create, single, clean
   * @default index.ts
   */
  exportFilename: string;
}
