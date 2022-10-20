import getExportInfos from '@compilers/getExportInfos';
import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import { TCreateOptionWithDirInfo } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import createDescendantIndex from '@modules/createDescendantIndex';
import createIndexInfos from '@modules/createIndexInfos';
import * as env from '@testenv/env';
import { getTestValue, posixJoin } from '@tools/misc';
import validateExportDuplication from '@validations/validateExportDuplication';
import validateFileNameDuplication from '@validations/validateFileNameDuplication';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';

const share: {
  project02Path: string;
  project02: tsm.Project;
  project03Path: string;
  project03: tsm.Project;
  project04Path: string;
  project04: tsm.Project;
} = {} as any;

beforeAll(() => {
  share.project02Path = posixJoin(env.exampleType02Path, 'tsconfig.json');
  share.project02 = new tsm.Project({ tsConfigFilePath: share.project02Path });

  share.project03Path = posixJoin(env.exampleType03Path, 'tsconfig.json');
  share.project03 = new tsm.Project({ tsConfigFilePath: share.project03Path });

  share.project04Path = posixJoin(env.exampleType04Path, 'tsconfig.json');
  share.project04 = new tsm.Project({ tsConfigFilePath: share.project04Path });
});

test('c001-createDescendantIndex-non-skip-empty-dir', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    skipEmptyDir: false,
    keepFileExt: false,
    startAt: projectPath,
    topDirDepth: 0,
    topDirs: [projectPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(exportInfos);
  const validateResult = validateFileNameDuplication(
    exportInfos.filter(
      (exportInfo) =>
        exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
    ),
    option,
  );
  const validExportInfos = exportInfos.filter(
    (exportInfo) =>
      validateResult.filePaths.includes(exportInfo.resolvedFilePath) === false &&
      exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
  );

  const result = await createDescendantIndex(
    replaceSepToPosix(env.exampleType03Path),
    validExportInfos,
    ignoreContents,
    option,
  );

  const sortedResult = result.sort((l, r) => {
    const depthDiff = l.depth - r.depth;
    if (depthDiff !== 0) {
      return depthDiff;
    }

    const dirDiff = l.resolvedDirPath.localeCompare(r.resolvedDirPath);
    if (dirDiff !== 0) {
      return dirDiff;
    }

    return l.exportStatement.localeCompare(r.exportStatement);
  });
  const terminateCircularResult = getTestValue(sortedResult);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));
  expectation.default.sort((l, r) => {
    const depthDiff = l.depth - r.depth;
    if (depthDiff !== 0) {
      return depthDiff;
    }

    const dirDiff = l.resolvedDirPath.localeCompare(r.resolvedDirPath);
    if (dirDiff !== 0) {
      return dirDiff;
    }

    return l.exportStatement.localeCompare(r.exportStatement);
  });

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c002-createDescendantIndex-do-skip-empty-dir', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    skipEmptyDir: true,
    keepFileExt: false,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(exportInfos);
  const validateResult = validateFileNameDuplication(
    exportInfos.filter(
      (exportInfo) =>
        exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
    ),
    option,
  );
  const validExportInfos = exportInfos.filter(
    (exportInfo) =>
      validateResult.filePaths.includes(exportInfo.resolvedFilePath) === false &&
      exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
  );

  const result = await createDescendantIndex(
    replaceSepToPosix(env.exampleType03Path),
    validExportInfos,
    ignoreContents,
    option,
  );
  const sortedResult = result.sort((l, r) => {
    const depthDiff = l.depth - r.depth;
    if (depthDiff !== 0) {
      return depthDiff;
    }

    const dirDiff = l.resolvedDirPath.localeCompare(r.resolvedDirPath);
    if (dirDiff !== 0) {
      return dirDiff;
    }

    return l.exportStatement.localeCompare(r.exportStatement);
  });
  const terminateCircularResult = getTestValue(sortedResult);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c003-createDescendantIndex-do-skip-empty-dir-case02', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    startAt: projectPath,
    skipEmptyDir: true,
    keepFileExt: false,
    topDirs: [projectPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(exportInfos);
  const validateResult = validateFileNameDuplication(
    exportInfos.filter(
      (exportInfo) =>
        exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
    ),
    option,
  );
  const validExportInfos = exportInfos.filter(
    (exportInfo) =>
      validateResult.filePaths.includes(exportInfo.resolvedFilePath) === false &&
      exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
  );

  const result = await createDescendantIndex(
    posixJoin(env.exampleType03Path, 'popcorn'),
    validExportInfos,
    ignoreContents,
    option,
  );
  const sortedResult = result.sort((l, r) => {
    const depthDiff = l.depth - r.depth;
    if (depthDiff !== 0) {
      return depthDiff;
    }

    const dirDiff = l.resolvedDirPath.localeCompare(r.resolvedDirPath);
    if (dirDiff !== 0) {
      return dirDiff;
    }

    return l.exportStatement.localeCompare(r.exportStatement);
  });
  const terminateCircularResult = getTestValue(sortedResult);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c004-createIndexInfos-non-skip-empty-dir', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);

  // option modify for expectation
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    startAt: projectPath,
    skipEmptyDir: false,
    keepFileExt: false,
    topDirs: [projectPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(exportInfos);
  const validateResult = validateFileNameDuplication(
    exportInfos.filter(
      (exportInfo) =>
        exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
    ),
    option,
  );
  const validExportInfos = exportInfos.filter(
    (exportInfo) =>
      validateResult.filePaths.includes(exportInfo.resolvedFilePath) === false &&
      exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
  );

  const result = await createIndexInfos(validExportInfos, ignoreContents, option);
  const terminateCircularResult = getTestValue(
    result.sort((l, r) => l.resolvedDirPath.localeCompare(r.resolvedDirPath)),
  );

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));
  const sortedExpectation = expectation.default.sort((l, r) =>
    l.resolvedDirPath.localeCompare(r.resolvedDirPath),
  );

  expect(terminateCircularResult).toEqual(sortedExpectation);
});

test('c005-createIndexInfos-do-skip-empty-dir', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);

  // option modify for expectation
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    startAt: projectPath,
    skipEmptyDir: true,
    keepFileExt: false,
    topDirs: [projectPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(exportInfos);
  const validateResult = validateFileNameDuplication(
    exportInfos.filter(
      (exportInfo) =>
        exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
    ),
    option,
  );
  const validExportInfos = exportInfos.filter(
    (exportInfo) =>
      validateResult.filePaths.includes(exportInfo.resolvedFilePath) === false &&
      exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
  );

  const result = await createIndexInfos(validExportInfos, ignoreContents, option);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c006-createIndexInfos-partial-ignore', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType04Path;
  const ignoreFilePath = posixJoin(projectPath, '.ctiignore_another_name');

  // option modify for expectation
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    skipEmptyDir: true,
    keepFileExt: false,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const exportInfos = await getExportInfos(share.project04, option, ignoreContents);
  const exportDuplicationValidateResult = validateExportDuplication(exportInfos);
  const validateResult = validateFileNameDuplication(
    exportInfos.filter(
      (exportInfo) =>
        exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
    ),
    option,
  );
  const validExportInfos = exportInfos.filter(
    (exportInfo) =>
      validateResult.filePaths.includes(exportInfo.resolvedFilePath) === false &&
      exportDuplicationValidateResult.filePaths.includes(exportInfo.resolvedFilePath) === false,
  );

  const result = await createIndexInfos(validExportInfos, ignoreContents, option);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});
