import TStreamType from '@configs/interfaces/TStreamType';

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
   * start working from startAt directory. If you do not pass startAt use project directory.
   * @mode all
   */
  a: string;
  /**
   * start working from startAt directory. If you do not pass startAt use project directory.
   * @mode all
   */
  startAt: string;

  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
   * @mode create, single, remove
   * @default index.ts
   */
  f: string;
  /**
   * Export filename, if you not pass this field that use "index.ts" or "index.d.ts"
   * @mode create, single, remove
   * @default index.ts
   */
  exportFilename: string;

  /**
   * Stream of cli spinner, you can pass stdout or stderr
   * @mode all
   * @default stdout
   */
  spinnerStream: TStreamType;

  /**
   * Stream of cli progress, you can pass stdout or stderr
   * @mode all
   * @default stdout
   */
  progressStream: TStreamType;

  /**
   * Stream of cli reasoner. Reasoner show name conflict error and already exist index.ts file error.
   * You can pass stdout or stderr
   *
   * @mode all
   * @default stderr
   */
  reasonerStream: TStreamType;
}
