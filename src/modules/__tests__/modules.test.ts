import getExportInfos from '@compilers/getExportInfos';
import tsMorphProjectOption from '@compilers/tsMorphProjectOption';
import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import { TCreateOptionWithDirInfo, TSingleOptionWithDirInfo } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import getDescendantExportInfo from '@modules/getDescendantExportInfo';
import getDirPaths from '@modules/getDirPaths';
import getFilePathOnIndex from '@modules/getFilePathOnIndex';
import mergeCreateIndexInfo from '@modules/mergeCreateIndexInfo';
import * as env from '@testenv/env';
import logger from '@tools/logger';
import { getTestValue, posixJoin } from '@tools/misc';
import validateExportDuplication from '@validations/validateExportDuplication';
import validateFileNameDuplication from '@validations/validateFileNameDuplication';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';

const log = logger();
const share: {
  projectPath02: string;
  project02: tsm.Project;
  projectPath03: string;
  project03: tsm.Project;
  projectPath04: string;
  project04: tsm.Project;
} = {} as any;

beforeAll(() => {
  log.level = 'debug';
  share.projectPath02 = posixJoin(env.exampleType02Path, 'tsconfig.json');
  share.project02 = new tsm.Project({
    tsConfigFilePath: share.projectPath02,
    ...tsMorphProjectOption,
  });

  share.projectPath03 = posixJoin(env.exampleType03Path, 'tsconfig.json');
  share.project03 = new tsm.Project({
    tsConfigFilePath: share.projectPath03,
    ...tsMorphProjectOption,
  });

  share.projectPath04 = posixJoin(env.exampleType04Path, 'tsconfig.json');
  share.project04 = new tsm.Project({
    tsConfigFilePath: share.projectPath04,
    ...tsMorphProjectOption,
  });
});

test('c001-getDirPaths', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    startAt: projectPath,
    skipEmptyDir: false,
    keepFileExt: false,
    topDirDepth: 0,
    topDirs: [projectPath],
  };

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

  const dirPaths = await getDirPaths(validExportInfos, ignoreContents, option);
  const terminateCircularResult = getTestValue(dirPaths);
  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c002-getFilePathOnIndex', async () => {
  const case01 = posixJoin(env.exampleType04Path, 'fast-maker', 'carpenter', 'DiscussionCls.ts');

  const filePathCase01 = getFilePathOnIndex(case01, { ...env.createOptionWithDirInfo });
  const filePathCase02 = getFilePathOnIndex(case01, {
    ...env.createOptionWithDirInfo,
    keepFileExt: true,
  });

  const option: TSingleOptionWithDirInfo = {
    ...env.singleOptionWithDirInfo,
    project: env.exampleType04Path,
    startAt: env.exampleType04Path,
    keepFileExt: false,
    topDirDepth: 0,
    topDirs: [env.exampleType04Path],
  };

  const filePathCase03 = getFilePathOnIndex(
    case01,
    option,
    replaceSepToPosix(env.exampleType04Path),
  );
  const filePathCase04 = getFilePathOnIndex(
    case01,
    { ...option, keepFileExt: true },
    replaceSepToPosix(env.exampleType04Path),
  );

  const expectation = [
    "'./DiscussionCls';",
    "'./DiscussionCls.ts';",
    "'./fast-maker/carpenter/DiscussionCls';",
    "'./fast-maker/carpenter/DiscussionCls.ts';",
  ].sort();

  const result = [filePathCase01, filePathCase02, filePathCase03, filePathCase04].sort();
  log.debug(filePathCase01, filePathCase02, filePathCase03, filePathCase04);

  expect(result).toEqual(expectation);
});

test('c003-getDescendantExportInfo', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    startAt: projectPath,
    skipEmptyDir: false,
    keepFileExt: false,
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

  const dirPath = posixJoin(env.exampleType03Path, 'popcorn');
  const result = await getDescendantExportInfo(dirPath, option, validExportInfos, ignoreContents);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c004-mergeCreateIndexInfo', async () => {
  const target = {
    depth: 5,
    resolvedDirPath: 'dirpath',
    resolvedFilePath: undefined,
    exportStatement: 'export * from ./test',
  };

  const origin = {
    depth: 5,
    resolvedDirPath: 'dirpath',
    resolvedFilePaths: undefined,
    exportStatements: ['export * from ./origin'],
  };

  const result = mergeCreateIndexInfo(origin, target);

  const expectation = {
    depth: 5,
    resolvedDirPath: 'dirpath',
    resolvedFilePaths: undefined,
    exportStatements: ['export * from ./origin', 'export * from ./test'],
  };

  expect(result).toEqual(expectation);
});
