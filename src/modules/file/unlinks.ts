import { exists } from 'my-node-fp';
import { unlink } from 'node:fs/promises';
import { isPromise } from 'node:util/types';

export async function unlinks(
  filePaths: string[],
  callback?: (filePath: string) => void | Promise<void>,
) {
  await Promise.all(
    filePaths.map(async (filePath) => {
      if (await exists(filePath)) {
        await unlink(filePath);

        if (callback != null) {
          const callbacked = callback(filePath);

          if (isPromise(callbacked)) {
            await callbacked;
          }
        }
      }
    }),
  );
}
