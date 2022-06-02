export default interface IOnlyCreateCliOption {
  mode: 'create';

  /**
   * If set true this option, skip empty directory
   * @mode create
   * @default false
   */
  e?: boolean;
  skipEmptyDir?: boolean;
}
