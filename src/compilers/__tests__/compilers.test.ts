import getExportedName from '@compilers/getExportedName';
import getExportInfo from '@compilers/getExportInfo';
import getExportInfos from '@compilers/getExportInfos';
import IExportInfo from '@compilers/interfaces/IExportInfo';
import defaultIgnoreFileName from '@configs/defaultIgnoreFileName';
import { TCreateOptionWithDirInfo } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import * as env from '@testenv/env';
import logger from '@tools/logger';
import { getTestValue, posixJoin } from '@tools/misc';
import fs from 'fs';
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
  projectPath05: string;
  project05: tsm.Project;
  projectPath06: string;
  project06: tsm.Project;
  projectPath07: string;
  project07: tsm.Project;
} = {} as any;

beforeAll(() => {
  log.level = 'debug';
  share.projectPath02 = posixJoin(env.exampleType02Path, 'tsconfig.json');
  share.project02 = new tsm.Project({ tsConfigFilePath: share.projectPath02 });

  share.projectPath03 = posixJoin(env.exampleType03Path, 'tsconfig.json');
  share.project03 = new tsm.Project({ tsConfigFilePath: share.projectPath03 });

  share.projectPath04 = posixJoin(env.exampleType04Path, 'tsconfig.json');
  share.project04 = new tsm.Project({ tsConfigFilePath: share.projectPath04 });

  share.projectPath05 = posixJoin(env.exampleType05Path, 'tsconfig.json');
  share.project05 = new tsm.Project({ tsConfigFilePath: share.projectPath05 });

  share.projectPath06 = posixJoin(env.exampleType06Path, 'tsconfig.json');
  share.project06 = new tsm.Project({ tsConfigFilePath: share.projectPath06 });

  share.projectPath07 = posixJoin(env.exampleType07Path, 'tsconfig.json');
  share.project07 = new tsm.Project({ tsConfigFilePath: share.projectPath07 });
});

test('c001-getExportedName', async () => {
  const files = await fs.promises.readdir(env.exampleType05Path);
  const sourceFiles = files
    .filter((filePath) => filePath.indexOf('tsconfig') < 0)
    .map((caseFile) =>
      share.project05.getSourceFileOrThrow(path.join(env.exampleType05Path, caseFile)),
    );

  const names = sourceFiles.map((sourceFile) => {
    const exportedDeclarations = sourceFile.getExportedDeclarations();
    const defaultExporteddeclarations = exportedDeclarations.get('default');

    if (defaultExporteddeclarations == null) {
      throw new Error('default export not found!');
    }

    log.debug('length: ', defaultExporteddeclarations.length);

    const [defaultExporteddeclaration] = defaultExporteddeclarations;
    return getExportedName(defaultExporteddeclaration);
  });

  const expectation = [
    'case01',
    'case02',
    'Case03',
    'Case04',
    'TTypeAliasName',
    'IInterfaceDeclaration',
    'ClassDeclaration',
    'Case08',
    'EN_CASE09_DEFAULT_EXPORT',
  ];

  names.sort();
  expectation.sort();

  expect(names).toEqual(expectation);
});

test('c006-getExportedName', async () => {
  const sourceFiles = share.project06.getSourceFiles();

  const names = sourceFiles
    .map((sourceFile) => {
      const exportedDeclarations = sourceFile.getExportedDeclarations();
      const exportedDeclarationNames = Array.from(exportedDeclarations.keys());

      log.debug('length: ', exportedDeclarationNames.length);

      return exportedDeclarationNames
        .map((exportedDeclarationName) => exportedDeclarations.get(exportedDeclarationName))
        .filter(
          (exportedDeclaration): exportedDeclaration is tsm.ExportedDeclarations[] =>
            exportedDeclaration !== undefined && exportedDeclaration !== null,
        )
        .flatMap((flatten) => flatten)
        .map((exportedDeclaration) => getExportedName(exportedDeclaration));
    })
    .flatMap((flatten) => flatten);

  const expectation = [
    'ChildlikeCls',
    'DiscussionCls',
    'FlakyCls',
    'MakeshiftCls',
    'WhisperingCls',
    'arrowCase003',
    'case004',
    'childlike',
    'childlikeCase002',
    'childlikeCase003',
    'flaky',
    'flakyCase002',
    'flakyCase003',
    'funcCase003',
    'greeting',
    'name',
    'nameCase001',
    'nameCase002',
    'nameCase003',
  ];

  names.sort();
  expectation.sort();

  expect(names).toEqual(expectation);
});

test('c007-getIsIsolatedModules', async () => {
  // project://example/type04/fast-maker/ChildlikeCls.ts
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType07Path;
  const project = share.project07;

  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);
  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const sourceFilePaths = [posixJoin(projectPath, 'Foo.ts'), posixJoin(projectPath, 'Bar.ts')];
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    topDirDepth: 0,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const results = (
    await Promise.all(
      sourceFilePaths.map(async (sourceFilePath) => {
        const sourceFile = project.getSourceFileOrThrow(sourceFilePath);
        const exportInfo = await getExportInfo(sourceFile, option, ignoreContents);
        return getTestValue(exportInfo) as IExportInfo;
      }),
    )
  ).sort((l, r) => l.resolvedFilePath.localeCompare(r.resolvedFilePath));

  const expectation: IExportInfo[] = (await import(path.join(__dirname, 'expects', expectFileName)))
    .default;

  expect(results).toEqual(
    expectation.sort((l, r) => l.resolvedFilePath.localeCompare(r.resolvedFilePath)),
  );
});

test('c002-getExportInfo', async () => {
  // project://example/type04/fast-maker/ChildlikeCls.ts
  const projectPath = env.exampleType04Path;
  const project = share.project04;

  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);
  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const sourceFilePath = posixJoin(projectPath, 'fast-maker', 'ChildlikeCls.ts');
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    topDirDepth: 0,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const sourceFile = project.getSourceFileOrThrow(sourceFilePath);
  const exportInfo = await getExportInfo(sourceFile, option, ignoreContents);

  expect(getTestValue(exportInfo)).toMatchSnapshot();
});

test('c003-getExportInfo', async () => {
  const projectPath = env.exampleType03Path;
  const project = share.project03;

  // project://example/type04/fast-maker/ChildlikeCls.ts
  // example\type03\popcorn\lawyer\appliance\bomb.ts
  const sourceFilePath = posixJoin(projectPath, 'popcorn', 'lawyer', 'appliance', 'bomb.ts');

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    skipEmptyDir: false,
    keepFileExt: false,
    topDirDepth: 0,
    topDirs: [projectPath],
  };

  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);
  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const sourceFile = project.getSourceFileOrThrow(sourceFilePath);
  const exportInfo = await getExportInfo(sourceFile, option, ignoreContents);

  expect(getTestValue(exportInfo)).toMatchSnapshot();
});

test('c004-getExportInfos-not-ignore', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const project = share.project03;

  const ignoreFilePath = posixJoin(projectPath, defaultIgnoreFileName);
  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    skipEmptyDir: false,
    keepFileExt: false,
    topDirDepth: 0,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const result = await getExportInfos(project, option, ignoreContents);
  const expectation = await import(path.join(__dirname, 'expects', expectFileName));
  const terminateCircularResult = getTestValue(result);

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c005-getExportInfos-partial-ignore', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType04Path;
  const project = share.project04;

  const ignoreFilePath = posixJoin(projectPath, '.ctiignore_another_name');
  const ignoreFiles = await getIgnoreConfigFiles(projectPath, ignoreFilePath);
  const ignoreContents = await getIgnoreConfigContents({
    cwd: projectPath,
    ...ignoreFiles,
  });

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    skipEmptyDir: false,
    keepFileExt: false,
    topDirDepth: 0,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const result = await getExportInfos(project, option, ignoreContents);
  const expectation = await import(path.join(__dirname, 'expects', expectFileName));
  const terminateCircularResult = getTestValue(result);

  expect(terminateCircularResult).toEqual(expectation.default);
});
