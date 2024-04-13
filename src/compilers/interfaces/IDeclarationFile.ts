export interface IDeclarationFile {
  path: {
    /**
     * filename of declaration file
     */
    filename: string;

    /**
     * dirname of declaration file
     */
    dirPath: string;

    /**
     * relative path of declaration file. Relative paths are generated based on rootDir or output dir.
     */
    relativePath: string;
  };
}
