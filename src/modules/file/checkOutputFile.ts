import type { IReason } from '#/compilers/interfaces/IReason';
import { exists } from 'my-node-fp';

export async function checkOutputFile(outputMap: Map<string, string>) {
  const filePaths = Array.from(outputMap.keys());

  const filePathExists = await Promise.all(
    filePaths.map(async (filePath) => {
      return { exists: await exists(filePath), filePath };
    }),
  );

  const reasons = filePathExists
    .filter((filePathExist) => filePathExist.exists)
    .map((filePathExist) => {
      const reason: IReason = {
        type: 'error',
        filePath: filePathExist.filePath,
        message: 'already exist `index.ts` file',
      };

      return reason;
    });

  return reasons;
}
