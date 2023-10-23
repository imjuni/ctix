import type { IInitQuestionAnswer } from '#/cli/interfaces/IInitQuestionAnswer';
import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { defaultIgnore } from '#/modules/ignore/defaultIgnore';
import { Glob } from 'glob';
import inquirer from 'inquirer';

export async function askInitOptions(): Promise<IInitQuestionAnswer> {
  const cwd = process.cwd();

  const cwdAnswer = await inquirer.prompt<Pick<IInitQuestionAnswer, 'cwd'>>([
    {
      type: 'input',
      name: 'cwd',
      default: cwd,
      message: 'Here is your working directory?',
    },
  ]);

  const glob = new Glob('**/tsconfig.json', { cwd: cwdAnswer.cwd, ignore: defaultIgnore });
  const tsconfigFiles = getGlobFiles(glob);

  const selectedConfig = await inquirer.prompt<Omit<IInitQuestionAnswer, 'cwd'>>([
    {
      type: 'checkbox',
      name: 'tsconfig',
      message: 'Select your tsconfig files',
      default: tsconfigFiles,
      choices: tsconfigFiles,
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
      message: 'Here is your working directory?',
    },
  ]);

  const answer: IInitQuestionAnswer = {
    ...cwdAnswer,
    ...selectedConfig,
  };

  return answer;
}
