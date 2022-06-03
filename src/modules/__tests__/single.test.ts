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
import fastGlob from 'fast-glob';
import { isFalse } from 'my-easy-fp';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';

const share: { projectPath: string; project: tsm.Project } = {} as any;

beforeAll(() => {
  consola.level = LogLevel.Debug;
  share.projectPath = posixJoin(env.examplePath, 'tsconfig.json');
  share.project = new tsm.Project({ tsConfigFilePath: share.projectPath });
});

test('c001-singleIndexInfos-type03', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const files = await fastGlob(
    [
      posixJoin(env.exampleType01Path, '**', '*'),
      posixJoin(env.exampleType02Path, '**', '*'),
      posixJoin(env.exampleType04Path, '**', '*'),
      posixJoin(env.exampleType05Path, '**', '*'),
    ],
    { cwd: replaceSepToPosix(env.examplePath) },
  );

  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    keepFileExt: false,
    output: env.exampleType03Path,
    topDirs: [env.exampleType03Path],
  };

  const ignores = files.reduce<Record<string, string | string[]>>((aggregation, file) => {
    return { ...aggregation, [file]: '*' };
  }, {});

  const exportInfos = await getExportInfos(share.project, option, ignores);
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

  const result = await singleIndexInfos(validExportInfos, option, share.project);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c002-singleIndexInfos-type04', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const files = await fastGlob(
    [
      posixJoin(env.exampleType01Path, '**', '*'),
      posixJoin(env.exampleType02Path, '**', '*'),
      posixJoin(env.exampleType03Path, '**', '*'),
      posixJoin(env.exampleType05Path, '**', '*'),
    ],
    { cwd: replaceSepToPosix(env.examplePath) },
  );

  // option modify for expectation
  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    keepFileExt: false,
    output: env.exampleType04Path,
    topDirs: [env.exampleType04Path],
  };

  const ignoreFiles = await getIgnoreConfigFiles(env.exampleType04Path);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: env.exampleType04Path,
    ...ignoreFiles,
  });

  const ignores = files.reduce<Record<string, string | string[]>>((aggregation, file) => {
    return { ...aggregation, [file]: '*', ...ignoreContents };
  }, {});

  const exportInfos = await getExportInfos(share.project, option, ignores);
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

  const result = await singleIndexInfos(validExportInfos, option, share.project);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});
