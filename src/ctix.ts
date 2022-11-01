import IReason from '@cli/interfaces/IReason';
import progress from '@cli/progress';
import reasoner from '@cli/reasoner';
import spinner from '@cli/spinner';
import getExportInfos from '@compilers/getExportInfos';
import getTypeScriptProject from '@compilers/getTypeScriptProject';
import tsMorphProjectOption from '@compilers/tsMorphProjectOption';
import initialConfigLiteral from '@configs/initialConfigLiteral';
import {
  TCreateOptionWithDirInfo,
  TRemoveOptionWithDirInfo,
  TSingleOptionWithDirInfo,
  TTInitOptionWithDirInfo,
} from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import createIndexInfos from '@modules/createIndexInfos';
import getRemoveFiles from '@modules/getRemoveFiles';
import singleIndexInfos from '@modules/singleIndexInfos';
import appendDotDirPrefix from '@tools/appendDotDirPrefix';
import validateExportDuplication from '@validations/validateExportDuplication';
import validateFileNameDuplication from '@validations/validateFileNameDuplication';
import indexFileWrite from '@writes/indexFileWrite';
import fs from 'fs';
import { applyEdits, FormattingOptions, ModificationOptions, modify } from 'jsonc-parser';
import { exists, getDirname, replaceSepToPosix } from 'my-node-fp';
import path from 'path';

export async function createWritor(option: TCreateOptionWithDirInfo, isMessageDisplay?: boolean) {
  try {
    progress.isEnable = isMessageDisplay ?? false;
    spinner.isEnable = isMessageDisplay ?? false;
    reasoner.isEnable = isMessageDisplay ?? false;

    progress.stream = option.progressStream;
    spinner.stream = option.spinnerStream;
    reasoner.stream = option.reasonerStream;

    spinner.start("ctix 'create' mode start, ...");

    const projectDirPath = await getDirname(option.resolvedProjectFilePath);
    const project = getTypeScriptProject({
      tsConfigFilePath: option.resolvedProjectFilePath,
      ...tsMorphProjectOption,
    });

    spinner.update('project loading complete');

    const ignoreFiles = await getIgnoreConfigFiles(projectDirPath, option.resolvedIgnoreFilePath);
    const ignoreContents = await getIgnoreConfigContents({ cwd: projectDirPath, ...ignoreFiles });

    spinner.update('ignore file loading complete');

    const totalExportInfos = await getExportInfos(project, option, ignoreContents);

    spinner.update('start validation');

    const exportDuplicationValidateResult = validateExportDuplication(totalExportInfos);
    const fileNameDuplicationValidateResult = validateFileNameDuplication(
      totalExportInfos.filter(
        (exportInfo) =>
          exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
      ),
      option,
    );
    const exportInfos = totalExportInfos.filter(
      (exportInfo) =>
        fileNameDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) ===
          false &&
        exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
    );

    if (
      fileNameDuplicationValidateResult.valid === false ||
      exportDuplicationValidateResult.valid === false
    ) {
      process.exitCode = 1;
    }

    spinner.update(`generate ${option.exportFilename} content`);

    const indexInfos = await createIndexInfos(exportInfos, ignoreContents, option);

    spinner.update(`write each ${option.exportFilename} file`);

    const writeReasons = await indexFileWrite(indexInfos, option);

    spinner.update(`ctix 'create' mode complete!`);

    reasoner.start([...exportDuplicationValidateResult.reasons, ...writeReasons]);
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    throw err;
  } finally {
    spinner.stop();
    progress.stop();
  }
}

export async function singleWritor(option: TSingleOptionWithDirInfo, isMessageDisplay?: boolean) {
  try {
    progress.isEnable = isMessageDisplay ?? false;
    spinner.isEnable = isMessageDisplay ?? false;
    reasoner.isEnable = isMessageDisplay ?? false;

    progress.stream = option.progressStream;
    spinner.stream = option.spinnerStream;
    reasoner.stream = option.reasonerStream;

    spinner.start("ctix 'single' mode start, ...");

    const projectDirPath = await getDirname(option.resolvedProjectFilePath);
    const project = getTypeScriptProject({
      tsConfigFilePath: option.resolvedProjectFilePath,
      ...tsMorphProjectOption,
    });

    spinner.update('project loading complete');

    const ignoreFiles = await getIgnoreConfigFiles(projectDirPath, option.resolvedIgnoreFilePath);
    const ignoreContents = await getIgnoreConfigContents({ cwd: projectDirPath, ...ignoreFiles });

    spinner.update('ignore file loading complete');

    const totalExportInfos = await getExportInfos(project, option, ignoreContents);
    const exportDuplicationValidateResult = validateExportDuplication(totalExportInfos);

    spinner.update('start validation');

    const exportInfos = totalExportInfos.filter(
      (exportInfo) =>
        exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
    );

    if (exportDuplicationValidateResult.valid === false) {
      process.exitCode = 1;
    }

    const indexInfos = await singleIndexInfos(exportInfos, ignoreContents, option, project);

    spinner.update(`generate ${option.exportFilename} content`);

    const writeReasons = await indexFileWrite(indexInfos, option);

    spinner.update(`write each ${option.exportFilename} file`);

    spinner.update(`ctix 'single' mode complete!`);

    reasoner.start([...exportDuplicationValidateResult.reasons, ...writeReasons]);
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    throw err;
  } finally {
    spinner.stop();
    progress.stop();
  }
}

export async function removeIndexFile(
  option: TRemoveOptionWithDirInfo,
  isMessageDisplay?: boolean,
) {
  try {
    progress.isEnable = isMessageDisplay ?? false;
    spinner.isEnable = isMessageDisplay ?? false;
    reasoner.isEnable = isMessageDisplay ?? false;

    spinner.start("ctix start 'remove' mode");
    reasoner.sleep(500);

    const project = getTypeScriptProject({
      tsConfigFilePath: option.resolvedProjectFilePath,
      ...tsMorphProjectOption,
    });
    const filePaths = await getRemoveFiles(project, option);

    spinner.update(`remove each ${option.exportFilename} file`);

    progress.start(filePaths.length, 0);

    await Promise.all(
      filePaths.map(async (filePath) => {
        await fs.promises.unlink(filePath);

        if (isMessageDisplay) {
          progress.increment();
        }
      }),
    );

    reasoner.space();
    spinner.update(`ctix 'remove' mode complete!`);
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    throw err;
  } finally {
    spinner.stop();
    progress.stop();
  }
}

export async function createInitFile(option: TTInitOptionWithDirInfo, isMessageDisplay?: boolean) {
  progress.isEnable = isMessageDisplay ?? false;
  spinner.isEnable = isMessageDisplay ?? false;
  reasoner.isEnable = isMessageDisplay ?? false;

  try {
    spinner.start("ctix 'init' mode start, ...");

    const configPath = await getDirname(
      option.config ?? option.project ?? path.resolve(process.cwd()),
    );

    const configFilePath = replaceSepToPosix(path.resolve(path.join(configPath, '.ctirc')));

    const formattingOptions: FormattingOptions = {
      insertSpaces: true,
      tabSize: 2,
      eol: '\n',
    };

    const options: ModificationOptions = {
      formattingOptions,
    };

    let modifiedInitialConfig: string = initialConfigLiteral;

    if (option.project != null) {
      const projectFilePath = appendDotDirPrefix(
        replaceSepToPosix(
          path.join(
            path.relative(configPath, await getDirname(option.project)),
            path.basename(option.project),
          ),
        ),
        path.posix.sep,
      );

      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['project'], projectFilePath, options),
      );
    }

    if (option.output != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(
          modifiedInitialConfig,
          ['output'],
          appendDotDirPrefix(
            replaceSepToPosix(path.relative(configPath, option.output)),
            path.posix.sep,
          ),
          options,
        ),
      );
    } else if (option.project != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(
          modifiedInitialConfig,
          ['output'],
          appendDotDirPrefix(
            replaceSepToPosix(path.relative(configPath, await getDirname(option.project))),
            path.posix.sep,
          ),
          options,
        ),
      );
    } else {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['output'], configPath, options),
      );
    }

    if (option.exportFilename != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['exportFilename'], option.exportFilename, options),
      );
    }

    if (option.startAt != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['startAt'], option.startAt, options),
      );
    }

    if (option.useSemicolon != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['useSemicolon'], option.useSemicolon, options),
      );
    }

    if (option.useTimestamp != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['useTimestamp'], option.useTimestamp, options),
      );
    }

    if (option.useComment != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['useComment'], option.useComment, options),
      );
    }

    if (option.quote != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['quote'], option.quote, options),
      );
    }

    if (option.keepFileExt != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['keepFileExt'], option.keepFileExt, options),
      );
    }

    if (option.skipEmptyDir != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['skipEmptyDir'], option.skipEmptyDir, options),
      );
    }

    if (option.useRootDir != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['useRootDir'], option.useRootDir, options),
      );
    }

    if (option.includeBackup != null) {
      modifiedInitialConfig = applyEdits(
        modifiedInitialConfig,
        modify(modifiedInitialConfig, ['includeBackup'], option.includeBackup, options),
      );
    }

    if (await exists(configFilePath)) {
      const reason: IReason = {
        type: 'error',
        filePath: configFilePath,
        message: `configuration file(.ctirc) is already exists: ${configFilePath}`,
      };

      reasoner.start([reason]);
    } else {
      await fs.promises.writeFile(configFilePath, modifiedInitialConfig);
    }

    spinner.update("ctix 'init' mode complete!");
  } catch (catched) {
    const err =
      catched instanceof Error ? catched : new Error('Unknown error raised from createWritor');

    throw err;
  } finally {
    spinner.stop();
    progress.stop();
  }
}
