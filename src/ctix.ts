import * as progress from '@cli/progress';
import * as reasoner from '@cli/reasoner';
import * as spinner from '@cli/spinner';
import getExportInfos from '@compilers/getExportInfos';
import getTypeScriptProject from '@compilers/getTypeScriptProject';
import { TOptionWithResolvedProject } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import createIndexInfos from '@modules/createIndexInfos';
import getCleanFiles from '@modules/getCleanFiles';
import singleIndexInfos from '@modules/singleIndexInfos';
import validateExportDuplication from '@validations/validateExportDuplication';
import validateFileNameDuplication from '@validations/validateFileNameDuplication';
import indexFileWrite from '@writes/indexFileWrite';
import consola from 'consola';
import fs from 'fs';
import { isFalse } from 'my-easy-fp';
import { getDirname } from 'my-node-fp';

export async function createWritor(option: TOptionWithResolvedProject, isMessageDisplay?: boolean) {
  try {
    progress.enable(isMessageDisplay ?? false);
    spinner.enable(isMessageDisplay ?? false);
    reasoner.enable(isMessageDisplay ?? false);

    spinner.start("ctix 'create' mode start, ...");

    const projectDirPath = await getDirname(option.resolvedProjectFilePath);
    const project = getTypeScriptProject(option.resolvedProjectFilePath);

    spinner.update('project loading complete');

    const ignoreFiles = await getIgnoreConfigFiles(projectDirPath);
    const ignoreContents = await getIgnoreConfigContents({ cwd: projectDirPath, ...ignoreFiles });

    spinner.update('ignore file loading complete');

    const totalExportInfos = await getExportInfos(project, option, ignoreContents);

    spinner.update('start validation');

    const exportDuplicationValidateResult = validateExportDuplication(totalExportInfos);
    const fileNameDuplicationValidateResult = validateFileNameDuplication(
      totalExportInfos.filter((exportInfo) =>
        isFalse(exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath)),
      ),
      option,
    );
    const exportInfos = totalExportInfos.filter(
      (exportInfo) =>
        isFalse(
          fileNameDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath),
        ) &&
        isFalse(exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath)),
    );

    spinner.update(`generate ${option.exportFilename} content`);

    const indexInfos = await createIndexInfos(exportInfos, ignoreContents, option);

    spinner.update(`write each ${option.exportFilename} file`);

    const writeReasons = await indexFileWrite(indexInfos, option);

    spinner.update(`ctix 'create' mode complete!`);

    reasoner.start([...exportDuplicationValidateResult.reasons, ...writeReasons]);
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    consola.error(err);
  } finally {
    spinner.stop();
  }
}

export async function singleWritor(option: TOptionWithResolvedProject, isMessageDisplay?: boolean) {
  try {
    progress.enable(isMessageDisplay ?? false);
    spinner.enable(isMessageDisplay ?? false);
    reasoner.enable(isMessageDisplay ?? false);

    spinner.start("ctix 'single' mode start, ...");

    const projectPath = await getDirname(option.resolvedProjectFilePath);
    const project = getTypeScriptProject(option.resolvedProjectFilePath);

    spinner.update('project loading complete');

    const ignoreFiles = await getIgnoreConfigFiles(projectPath);
    const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

    spinner.update('ignore file loading complete');

    const totalExportInfos = await getExportInfos(project, option, ignoreContents);
    const exportDuplicationValidateResult = validateExportDuplication(totalExportInfos);

    spinner.update('start validateion');

    const exportInfos = totalExportInfos.filter((exportInfo) =>
      isFalse(exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath)),
    );

    const indexInfos = await singleIndexInfos(exportInfos, option, project);

    spinner.update(`generate ${option.exportFilename} content`);

    const writeReasons = await indexFileWrite(indexInfos, option);

    spinner.update(`write each ${option.exportFilename} file`);

    spinner.update(`ctix 'single' mode complete!`);

    reasoner.start([...exportDuplicationValidateResult.reasons, ...writeReasons]);
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    consola.error(err);
  } finally {
    spinner.stop();
  }
}

export async function cleanIndexFile(
  option: TOptionWithResolvedProject,
  isMessageDisplay?: boolean,
) {
  try {
    progress.enable(isMessageDisplay ?? false);
    spinner.enable(isMessageDisplay ?? false);

    spinner.start("ctix start 'clean' mode");

    const project = getTypeScriptProject(option.resolvedProjectFilePath);
    const filePaths = await getCleanFiles(project, option);

    spinner.update(`clean each ${option.exportFilename} file`);

    progress.start(filePaths.length, 0);

    await Promise.all(
      filePaths.map(async (filePath) => {
        await fs.promises.unlink(filePath);

        if (isMessageDisplay) {
          progress.increment();
        }
      }),
    );

    spinner.update(`ctix 'clean' mode complete!`);
    spinner.stop();
    progress.stop();
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    consola.error(err);
  }
}
