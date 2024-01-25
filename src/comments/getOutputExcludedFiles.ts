import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import { posixJoin } from '#/modules/path/posixJoin';
import { settify } from 'my-easy-fp';
import { getDirname } from 'my-node-fp';
import type * as tsm from 'ts-morph';

export async function getOutputExcludedFiles(params: {
  project: tsm.Project;
  extendOptions: Pick<IExtendOptions, 'eol'>;
  exportFilename: string;
  filePaths: string[];
}) {
  const outputDirPaths = await Promise.all(
    params.filePaths
      .map((filePath) => params.project.getSourceFile(filePath))
      .filter((sourceFile): sourceFile is tsm.SourceFile => sourceFile != null)
      .map(async (sourceFile) => {
        const filePath = sourceFile.getFilePath().toString();
        const dirPath = await getDirname(filePath);
        return dirPath;
      }),
  );

  const outputFiles = settify(outputDirPaths).map((dirPath) =>
    posixJoin(dirPath, params.exportFilename),
  );

  return outputFiles;
}
