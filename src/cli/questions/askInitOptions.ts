import type { IInitQuestionAnswer } from '#/cli/interfaces/IInitQuestionAnswer';
import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getTsconfigComparer } from '#/configs/modules/getTsconfigComparer';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { posixJoin } from '#/modules/path/posixJoin';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import chalk from 'chalk';
import { exists } from 'find-up';
import { Glob } from 'glob';
import inquirer from 'inquirer';

export async function askInitOptions(): Promise<IInitQuestionAnswer> {
  const cwd = process.cwd();

  const cwdAnswer = await inquirer.prompt<Pick<IInitQuestionAnswer, 'cwd'>>([
    {
      type: 'input',
      name: 'cwd',
      default: cwd,
      message: 'Enter the working directory',
    },
  ]);

  const optionFilePath = posixJoin(cwdAnswer.cwd, CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME);
  const optionFileExist = await exists(optionFilePath);
  const glob = new Glob(['**/tsconfig.json', '**/tsconfig.*.json'], {
    cwd: cwdAnswer.cwd,
    ignore: defaultExclude,
  });
  const tsconfigFiles = getGlobFiles(glob);
  const sortedTsconfigFiles = tsconfigFiles.sort(getTsconfigComparer(cwdAnswer.cwd));

  if (optionFileExist) {
    const overwriteAnswer = await inquirer.prompt<Pick<IInitQuestionAnswer, 'overwirte'>>([
      {
        type: 'confirm',
        name: 'overwirte',
        message: `Already exists ${chalk.redBright(optionFilePath)}, overwrite it?`,
        default: false,
      },
    ]);

    if (!overwriteAnswer.overwirte) {
      return {
        cwd: cwdAnswer.cwd,
        overwirte: overwriteAnswer.overwirte,
        tsconfig: [],
        mode: CE_CTIX_BUILD_MODE.BUNDLE_MODE,
        exportFilename: CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
      } satisfies IInitQuestionAnswer;
    }
  }

  const selectedConfig = await inquirer.prompt<Omit<IInitQuestionAnswer, 'cwd' | 'overwrite'>>([
    {
      type: 'checkbox',
      name: 'tsconfig',
      message: 'Select your tsconfig files',
      default: sortedTsconfigFiles,
      choices: sortedTsconfigFiles,
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Select index.ts file build mode',
      default: CE_CTIX_BUILD_MODE.BUNDLE_MODE,
      choices: [CE_CTIX_BUILD_MODE.BUNDLE_MODE, CE_CTIX_BUILD_MODE.CREATE_MODE],
    },
    {
      type: 'input',
      name: 'exportFilename',
      default: CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
      message: 'Enter the bundle file name',
    },
  ]);

  const answer: IInitQuestionAnswer = {
    ...cwdAnswer,
    ...selectedConfig,
    overwirte: true,
  };

  return answer;
}
