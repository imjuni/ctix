import type { TStreamType } from '#/configs/interfaces/TStreamType';

export interface IProjectOptions {
  /**
   * configuration file(.ctirc) path
   */
  config: string;

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
