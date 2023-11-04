export interface ICommandCreateOptions {
  /**
   * If `skipEmptyDir` is set to true, an empty directory with no files will not create an `index.ts` file
   *
   * @command build
   * @mode create
   *
   * @default true
   */
  skipEmptyDir: boolean;

  /**
   * index.ts 파일 생성을 시작할 시작 디렉터리를 지정합니다
   * Specify the starting directory to start creating the `index.ts` file
   *
   * @command build
   * @mode create
   *
   * @default tsconfig.json file directory
   */
  startFrom: string;
}
