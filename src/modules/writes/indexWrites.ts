import type { IExtendOptions } from '#/configs/interfaces/IExtendOptions';
import type { TBundleOptions } from '#/configs/interfaces/TBundleOptions';
import type { TCreateOptions } from '#/configs/interfaces/TCreateOptions';
import { getBanner } from '#/modules/writes/getBanner';
import { prettifing } from '#/modules/writes/prettifing';
import { CE_TEMPLATE_NAME } from '#/templates/const-enum/CE_TEMPLATE_NAME';
import type { IIndexFileWriteParams } from '#/templates/interfaces/IIndexFileWriteParams';
import { TemplateContainer } from '#/templates/modules/TemplateContainer';
import dayjs from 'dayjs';
import { readFile, writeFile } from 'fs/promises';
import { exists } from 'my-node-fp';

export async function indexWrites(
  outputMap: Map<string, string>,
  option: TCreateOptions | TBundleOptions,
  extendOptions: IExtendOptions,
) {
  await Promise.all(
    Array.from(outputMap.entries())
      .map(([filePath, fileContent]) => ({ filePath, fileContent }))
      .map(async (file) => {
        const rendered = await TemplateContainer.evaluate(CE_TEMPLATE_NAME.INDEX_FILE_TEMPLATE, {
          directive: option.directive,
          banner: getBanner(option, dayjs()),
          eol: extendOptions.eol,
          content: file.fileContent,
        } satisfies IIndexFileWriteParams);

        const prettified = await prettifing(
          extendOptions.resolved.projectDirPath,
          `${rendered}${extendOptions.eol}`,
        );

        if (option.noBackup) {
          await writeFile(file.filePath, `${prettified.contents.trim()}${extendOptions.eol}`);
        } else {
          if (await exists(file.filePath)) {
            await writeFile(`${file.filePath}.bak`, await readFile(file.filePath));
          }

          await writeFile(file.filePath, `${prettified.contents.trim()}${extendOptions.eol}`);
        }
      }),
  );
}
