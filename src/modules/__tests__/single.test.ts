import getExportInfos from '@compilers/getExportInfos';
import { TSingleOptionWithDirInfo } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import singleIndexInfos from '@modules/singleIndexInfos';
import * as env from '@testenv/env';
import { getTestValue, posixJoin } from '@tools/misc';
import validateExportDuplication from '@validations/validateExportDuplication';
import validateFileNameDuplication from '@validations/validateFileNameDuplication';
import consola, { LogLevel } from 'consola';
import { isFalse } from 'my-easy-fp';
import path from 'path';
import * as tsm from 'ts-morph';

const share: {
  projectPath02: string;
  project02: tsm.Project;
  projectPath03: string;
  project03: tsm.Project;
  projectPath04: string;
  project04: tsm.Project;
} = {} as any;

beforeAll(() => {
  consola.level = LogLevel.Debug;

  share.projectPath02 = posixJoin(env.exampleType02Path, 'tsconfig.json');
  share.project02 = new tsm.Project({ tsConfigFilePath: share.projectPath02 });

  share.projectPath03 = posixJoin(env.exampleType03Path, 'tsconfig.json');
  share.project03 = new tsm.Project({ tsConfigFilePath: share.projectPath03 });

  share.projectPath04 = posixJoin(env.exampleType04Path, 'tsconfig.json');
  share.project04 = new tsm.Project({ tsConfigFilePath: share.projectPath04 });
});

test('c001-singleIndexInfos-type03', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const projectPath = env.exampleType03Path;
  const project = share.project03;

  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    project: projectPath,
    keepFileExt: false,
    output: projectPath,
    topDirs: [projectPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(projectPath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const exportInfos = await getExportInfos(project, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(exportInfos);
  const validateResult = validateFileNameDuplication(
    exportInfos.filter((exportInfo) =>
      isFalse(exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath)),
    ),
    option,
  );
  const validExportInfos = exportInfos.filter(
    (exportInfo) =>
      isFalse(validateResult.filePaths.includes(exportInfo.resolvedFilePath)) &&
      isFalse(exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath)),
  );

  const result = await singleIndexInfos(validExportInfos, ignoreContents, option, project);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c002-singleIndexInfos-type04', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const projectPath = env.exampleType04Path;
  const project = share.project04;

  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    keepFileExt: false,
    project: projectPath,
    output: projectPath,
    topDirs: [projectPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(projectPath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const exportInfos = await getExportInfos(project, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(exportInfos);
  const validateResult = validateFileNameDuplication(
    exportInfos.filter((exportInfo) =>
      isFalse(exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath)),
    ),
    option,
  );
  const validExportInfos = exportInfos.filter(
    (exportInfo) =>
      isFalse(validateResult.filePaths.includes(exportInfo.resolvedFilePath)) &&
      isFalse(exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath)),
  );

  const result = await singleIndexInfos(validExportInfos, ignoreContents, option, project);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});
