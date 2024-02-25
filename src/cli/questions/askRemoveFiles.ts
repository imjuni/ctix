import type { IChoiceTypeItem } from '#/cli/interfaces/IChoiceTypeItem';
import { getRatioNumber } from '#/cli/modules/getRatioNumber';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { posixRelative } from '#/modules/path/modules/posixRelative';
import Fuse from 'fuse.js';
import inquirer from 'inquirer';
import { CheckboxPlusPrompt } from 'inquirer-ts-checkbox-plus-prompt';

export async function askRemoveFiles(filePaths: string[]) {
  inquirer.registerPrompt('checkbox-plus', CheckboxPlusPrompt);

  const choiceAbleTypes = filePaths.map((filePath) => {
    return {
      filePath,
      name: posixRelative(process.cwd(), filePath),
      value: filePath,
    } satisfies IChoiceTypeItem;
  });

  const fuse = new Fuse(choiceAbleTypes, {
    includeScore: true,
    keys: ['identifier', 'filePath'],
  });

  const answer = await inquirer.prompt<{ indexFiles: string[] }>([
    {
      type: 'checkbox-plus',
      name: 'indexFiles',
      pageSize: 20,
      highlight: true,
      searchable: true,
      message: 'Select `index.ts` for delete from project: ',
      default: choiceAbleTypes.map((item) => item.value),
      validate(removeIndexFiles: string[]) {
        if (removeIndexFiles.length === 0) {
          return 'You must choose at least one type in `index.ts` files.';
        }

        return true;
      },
      source: (_answersSoFar: unknown, input?: string) => {
        const safeInput = input == null ? '' : input;

        if (safeInput === '') {
          return Promise.resolve(choiceAbleTypes);
        }

        return Promise.resolve(
          fuse
            .search(safeInput)
            .map((matched) => {
              return {
                ...matched,
                oneBased: getRatioNumber(matched.score ?? 0),
                percent: getRatioNumber(matched.score ?? 0, 100),
              };
            })
            .filter((matched) => matched.percent >= CE_CTIX_DEFAULT_VALUE.REMOVE_FILE_CHOICE_FUZZY)
            .sort((l, r) => r.percent - l.percent)
            .map((matched) => matched.item),
        );
      },
    },
  ]);

  return answer.indexFiles;
}
