import type { IInitQuestionAnswer } from '#/cli/interfaces/IInitQuestionAnswer';
import { CE_CTIX_BUILD_MODE } from '#/configs/const-enum/CE_CTIX_BUILD_MODE';
import { CE_CTIX_DEFAULT_VALUE } from '#/configs/const-enum/CE_CTIX_DEFAULT_VALUE';
import { getTsconfigComparer } from '#/configs/modules/getTsconfigComparer';
import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import chalk from 'chalk';
import { exists } from 'find-up';
import { Glob } from 'glob';
import inquirer from 'inquirer';
import pathe from 'pathe';

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

  const optionFilePath = pathe.join(cwdAnswer.cwd, CE_CTIX_DEFAULT_VALUE.CONFIG_FILENAME);
  const optionFileExist = await exists(optionFilePath);
  const tsconfigGlob = new Glob(['**/tsconfig.json', '**/tsconfig.*.json'], {
    cwd: cwdAnswer.cwd,
    ignore: defaultExclude,
  });
  const tsconfigFiles = getGlobFiles(tsconfigGlob);
  const packageJsonGlob = new Glob(['**/package.json'], {
    cwd: cwdAnswer.cwd,
    ignore: defaultExclude,
  });
  const packageJsonFiles = getGlobFiles(packageJsonGlob);
  const sortedTsconfigFiles = tsconfigFiles.sort(getTsconfigComparer(cwdAnswer.cwd));
  const sortedPackageJsonFiles = packageJsonFiles.sort(getTsconfigComparer(cwdAnswer.cwd));

  const userSelectedAnswer = await inquirer.prompt<Omit<IInitQuestionAnswer, 'cwd' | 'overwrite'>>([
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
      type: 'confirm',
      name: 'addEveryOptions',
      message: 'Do you want to include all available options in the configuration file?',
      default: false,
    },
    {
      type: 'list',
      name: 'configPosition',
      message: 'Where do you want to add the configuration?',
      default: '.ctirc',
      choices: ['.ctirc', 'tsconfig.json', 'package.json'],
    },
    {
      type: 'list',
      name: 'packageJson',
      message: 'Select your package.json files',
      default: sortedPackageJsonFiles,
      choices: sortedPackageJsonFiles,
      when: (answer) => {
        return answer.configPosition === 'package.json';
      },
    },
    {
      type: 'confirm',
      name: 'configComment',
      message: 'Do you want to add a comment to the configuration?',
      default: true,
      when: (answer) => {
        return answer.configPosition !== 'package.json';
      },
    },
    {
      type: 'confirm',
      name: 'confirmBackupPackageTsconfig',
      message: (answer) => `Do you want to create a backup file from ${answer.configPosition}?`,
      default: true,
      when: (answer) => {
        return answer.configPosition === 'tsconfig.json';
      },
    },
    {
      type: 'input',
      name: 'exportFilename',
      default: CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
      message: 'Enter the bundle file name',
    },
  ]);

  if (userSelectedAnswer.configPosition === '.ctirc' && optionFileExist) {
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
        addEveryOptions: false,
        packageJson: pathe.join(process.cwd(), CE_CTIX_DEFAULT_VALUE.PACKAGE_JSON_FILENAME),
        mode: CE_CTIX_BUILD_MODE.BUNDLE_MODE,
        configPosition: '.ctirc',
        configComment: true,
        confirmBackupPackageTsconfig: true,
        exportFilename: CE_CTIX_DEFAULT_VALUE.EXPORT_FILENAME,
      } satisfies IInitQuestionAnswer;
    }
  }

  const answer: IInitQuestionAnswer = {
    ...cwdAnswer,
    ...userSelectedAnswer,
    overwirte: true,
  };

  return answer;
}
