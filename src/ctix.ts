import messageDisplay from '@cli/messageDisplay';
import { increment, start, stop } from '@cli/progress';
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
import ora from 'ora';

export async function createWritor(option: TOptionWithResolvedProject, isMessageDisplay?: boolean) {
  const spinner = ora("ctix start 'create' mode");

  try {
    if (isMessageDisplay) {
      spinner.start();
    }

    const projectDirPath = await getDirname(option.resolvedProjectFilePath);
    const project = getTypeScriptProject(option.resolvedProjectFilePath);

    if (isMessageDisplay) {
      spinner.text = 'project loading complete';
    }

    const ignoreFiles = await getIgnoreConfigFiles(projectDirPath);
    const ignoreContents = await getIgnoreConfigContents({ cwd: projectDirPath, ...ignoreFiles });

    if (isMessageDisplay) {
      spinner.text = 'ignore file loading complete';
    }

    const totalExportInfos = await getExportInfos(project, option, ignoreContents);

    if (isMessageDisplay) {
      spinner.text = 'start validateion';
    }

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

    if (isMessageDisplay) {
      spinner.text = `generate ${option.exportFilename} content`;
    }

    const indexInfos = await createIndexInfos(
      exportInfos,
      ignoreContents,
      option,
      isMessageDisplay,
    );

    if (isMessageDisplay) {
      spinner.text = `write each ${option.exportFilename} file`;
    }

    const writeReasons = await indexFileWrite(indexInfos, option);

    if (isMessageDisplay) {
      spinner.text = `ctix 'create' mode complete!`;
    }

    if (isMessageDisplay) {
      messageDisplay([...exportDuplicationValidateResult.reasons, ...writeReasons]);
    }
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    consola.error(err);
  } finally {
    spinner.stopAndPersist();
  }
}

export async function singleWritor(option: TOptionWithResolvedProject) {
  const projectPath = await getDirname(option.resolvedProjectFilePath);
  const project = getTypeScriptProject(option.resolvedProjectFilePath);

  const ignoreFiles = await getIgnoreConfigFiles(projectPath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const totalExportInfos = await getExportInfos(project, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(totalExportInfos);

  const exportInfos = totalExportInfos.filter((exportInfo) =>
    isFalse(exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath)),
  );

  const indexInfos = await singleIndexInfos(exportInfos, option, project);
  const reasons = await indexFileWrite(indexInfos, option);

  consola.debug(reasons);
}

export async function cleanIndexFile(
  option: TOptionWithResolvedProject,
  isMessageDisplay?: boolean,
) {
  const spinner = ora("ctix start 'clean' mode");

  try {
    if (isMessageDisplay) {
      spinner.start();
    }

    const project = getTypeScriptProject(option.resolvedProjectFilePath);
    const filePaths = await getCleanFiles(project, option);

    if (isMessageDisplay) {
      spinner.text = `clean each ${option.exportFilename} file`;
    }

    if (isMessageDisplay) {
      start(filePaths.length, 0);
    }

    await Promise.all(
      filePaths.map(async (filePath) => {
        await fs.promises.unlink(filePath);

        if (isMessageDisplay) {
          increment();
        }
      }),
    );

    if (isMessageDisplay) {
      spinner.text = `ctix 'clean' mode complete!`;
      spinner.stopAndPersist();

      stop();
    }
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    consola.error(err);
  }
}
