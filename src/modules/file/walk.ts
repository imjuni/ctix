import { posixJoin } from '#/modules/path/posixJoin';
import { isDirectory } from 'my-node-fp';
import fs from 'node:fs';
import path from 'node:path';
import { isPromise } from 'node:util/types';

export async function dfsWalk(
  currentDirPath: string,
  callback: (params: { dirPath: string; filePaths: string[] }) => void | Promise<void>,
) {
  const resolved = path.resolve(currentDirPath);
  const readed = await fs.promises.readdir(resolved);

  const dirPaths = (
    await Promise.all(
      readed.map(async (filePath) => {
        if (await isDirectory(posixJoin(resolved, filePath))) {
          return filePath;
        }

        return undefined;
      }),
    )
  ).filter((dirPath): dirPath is string => dirPath != null);
  const filePaths = readed.filter((filePath) => !dirPaths.includes(filePath));

  const callbacked = callback({ dirPath: currentDirPath, filePaths });

  if (isPromise(callbacked)) {
    await callbacked;
  }

  await dirPaths.reduce(async (prevHandle, dirPath) => {
    const handle = async () => {
      await dfsWalk(posixJoin(resolved, dirPath), callback);
    };

    await prevHandle;

    return handle();
  }, Promise.resolve());
}
