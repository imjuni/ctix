import getExportInfos from '@compilers/getExportInfos';
import { TCreateOptionWithDirInfo } from '@configs/interfaces/IOption';
import getEmptyDescendantTree from '@ignores/getEmptyDescendantTree';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import createDescendantIndex from '@modules/createDescendantIndex';
import createIndexInfos from '@modules/createIndexInfos';
import * as env from '@testenv/env';
import { getTestValue, posixJoin } from '@tools/misc';
import validateExportDuplication from '@validations/validateExportDuplication';
import validateFileNameDuplication from '@validations/validateFileNameDuplication';
import consola, { LogLevel } from 'consola';
import { isFalse } from 'my-easy-fp';
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
  consola.level = LogLevel.Debug;
  share.project02Path = posixJoin(env.exampleType02Path, 'tsconfig.json');
  share.project02 = new tsm.Project({ tsConfigFilePath: share.project02Path });

  share.project03Path = posixJoin(env.exampleType03Path, 'tsconfig.json');
  share.project03 = new tsm.Project({ tsConfigFilePath: share.project03Path });

  share.project04Path = posixJoin(env.exampleType04Path, 'tsconfig.json');
  share.project04 = new tsm.Project({ tsConfigFilePath: share.project04Path });
});

test('c001-createDescendantIndex-non-skip-empty-dir', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');
  const dirPath = env.exampleType03Path;

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    skipEmptyDir: false,
    keepFileExt: false,
    topDirDepth: 0,
    topDirs: [dirPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(dirPath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: dirPath,
    ...ignoreFiles,
  });
  const ignoreDirs = await getEmptyDescendantTree({
    cwd: dirPath,
    ignores: ignoreContents.evaluated,
  });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
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

  const result = await createDescendantIndex(
    replaceSepToPosix(env.exampleType03Path),
    validExportInfos,
    { ...ignoreContents, dirs: ignoreDirs },
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
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const dirPath = env.exampleType03Path;
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    skipEmptyDir: true,
    keepFileExt: false,
    topDirs: [dirPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(dirPath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: dirPath, ...ignoreFiles });
  const ignoreDirs = await getEmptyDescendantTree({
    cwd: dirPath,
    ignores: ignoreContents.evaluated,
  });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
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

  const result = await createDescendantIndex(
    replaceSepToPosix(env.exampleType03Path),
    validExportInfos,
    { ...ignoreContents, dirs: ignoreDirs },
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

test('c003-createIndexInfos-non-skip-empty-dir', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const dirPath = env.exampleType03Path;

  // option modify for expectation
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    skipEmptyDir: false,
    keepFileExt: false,
    topDirs: [dirPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(dirPath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: dirPath, ...ignoreFiles });
  const ignoreDirs = await getEmptyDescendantTree({
    cwd: dirPath,
    ignores: ignoreContents.evaluated,
  });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
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

  const result = await createIndexInfos(
    validExportInfos,
    { ...ignoreContents, dirs: ignoreDirs },
    option,
  );
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c004-createIndexInfos-do-skip-empty-dir', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const dirPath = env.exampleType03Path;

  // option modify for expectation
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    skipEmptyDir: true,
    keepFileExt: false,
    topDirs: [dirPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(dirPath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: dirPath, ...ignoreFiles });
  const ignoreDirs = await getEmptyDescendantTree({
    cwd: dirPath,
    ignores: ignoreContents.evaluated,
  });

  const exportInfos = await getExportInfos(share.project03, option, ignoreContents);
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

  const result = await createIndexInfos(
    validExportInfos,
    { ...ignoreContents, dirs: ignoreDirs },
    option,
  );
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c005-createIndexInfos-partial-ignore', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const dirPath = env.exampleType04Path;

  // option modify for expectation
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    skipEmptyDir: true,
    keepFileExt: false,
    topDirs: [dirPath],
  };

  const ignoreFiles = await getIgnoreConfigFiles(dirPath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: dirPath, ...ignoreFiles });
  const ignoreDirs = await getEmptyDescendantTree({
    cwd: dirPath,
    ignores: ignoreContents.evaluated,
  });

  const exportInfos = await getExportInfos(share.project04, option, ignoreContents);
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

  const result = await createIndexInfos(
    validExportInfos,
    { ...ignoreContents, dirs: ignoreDirs },
    option,
  );
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});
