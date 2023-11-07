import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import type { TModuleOptions } from '#/configs/interfaces/TModuleOptions';
import { prettifing } from '#/modules/writes/prettifing';
import { exists } from 'my-node-fp';
import { readFile, writeFile } from 'node:fs/promises';

export async function indexWrites(
  indexFiles: { path: string; content: string }[],
  option: Pick<
    TCreateOptions | TBundleOptions | TModuleOptions,
    'directive' | 'useBanner' | 'useTimestamp' | 'backup'
  >,
  extendOptions: IExtendOptions,
) {
  await Promise.all(
    indexFiles.map(async (file) => {
      const prettified = await prettifing(
        extendOptions.resolved.projectDirPath,
        `${file.content}${extendOptions.eol}`,
      );

      if (option.backup) {
        if (await exists(file.path)) {
          await writeFile(`${file.path}.bak`, await readFile(file.path));
        }

        await writeFile(file.path, `${prettified.contents.trim()}${extendOptions.eol}`);
      } else {
        await writeFile(file.path, `${prettified.contents.trim()}${extendOptions.eol}`);
      }
    }),
  );
}
