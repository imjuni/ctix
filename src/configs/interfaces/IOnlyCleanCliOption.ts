export default interface IOnlyCleanCliOption {
  mode: 'clean';

  /**
   * clean with backup file
   * @mode clean
   * @default false
   */
  b?: boolean;
  includeBackup?: boolean;
}
