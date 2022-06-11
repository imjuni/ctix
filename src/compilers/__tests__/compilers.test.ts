import getExportedName from '@compilers/getExportedName';
import getExportInfo from '@compilers/getExportInfo';
import getExportInfos from '@compilers/getExportInfos';
import { TCreateOptionWithDirInfo } from '@configs/interfaces/IOption';
import getIgnoreConfigContents from '@ignores/getIgnoreConfigContents';
import getIgnoreConfigFiles from '@ignores/getIgnoreConfigFiles';
import * as env from '@testenv/env';
import { getTestValue, posixJoin } from '@tools/misc';
import consola, { LogLevel } from 'consola';
import fs from 'fs';
import { isEmpty } from 'my-easy-fp';
import { getDirname, replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';

const share: {
  projectPath02: string;
  project02: tsm.Project;
  projectPath03: string;
  project03: tsm.Project;
  projectPath04: string;
  project04: tsm.Project;
  projectPath05: string;
  project05: tsm.Project;
} = {} as any;

beforeAll(() => {
  consola.level = LogLevel.Debug;

  share.projectPath02 = posixJoin(env.exampleType02Path, 'tsconfig.json');
  share.project02 = new tsm.Project({ tsConfigFilePath: share.projectPath02 });

  share.projectPath03 = posixJoin(env.exampleType03Path, 'tsconfig.json');
  share.project03 = new tsm.Project({ tsConfigFilePath: share.projectPath03 });

  share.projectPath04 = posixJoin(env.exampleType04Path, 'tsconfig.json');
  share.project04 = new tsm.Project({ tsConfigFilePath: share.projectPath04 });

  share.projectPath05 = posixJoin(env.exampleType05Path, 'tsconfig.json');
  share.project05 = new tsm.Project({ tsConfigFilePath: share.projectPath05 });
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

    if (isEmpty(defaultExporteddeclarations)) {
      throw new Error('default export not found!');
    }

    consola.debug('length: ', defaultExporteddeclarations.length);

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

test('c002-getExportInfo', async () => {
  // project://example/type04/fast-maker/ChildlikeCls.ts
  const projectPath = env.exampleType04Path;
  const project = share.project04;

  const sourceFilePath = posixJoin(projectPath, 'fast-maker', 'ChildlikeCls.ts');
  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    topDirDepth: 0,
    topDirs: [projectPath],
  };

  const sourceFile = project.getSourceFileOrThrow(sourceFilePath);
  const result = await getExportInfo(sourceFile, option, {
    [sourceFilePath]: ['name'],
  });
  const terminateCircularResult = getTestValue(result);

  const expectation = {
    resolvedFilePath: posixJoin(env.exampleType04Path, 'fast-maker', 'ChildlikeCls.ts'),
    resolvedDirPath: await getDirname(
      posixJoin(env.exampleType04Path, 'fast-maker', 'ChildlikeCls.ts'),
    ),
    relativeFilePath: replaceSepToPosix(
      path.relative(
        env.exampleType04Path,
        posixJoin(env.exampleType04Path, 'fast-maker', 'ChildlikeCls.ts'),
      ),
    ),
    depth: 2,
    starExported: false,
    defaultExport: { identifier: 'ChildlikeCls' },
    namedExports: [{ identifier: 'ChildlikeCls' }, { identifier: 'greeting' }],
  };

  expect(terminateCircularResult).toEqual(expectation);
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

  const sourceFile = project.getSourceFileOrThrow(sourceFilePath);
  const result = await getExportInfo(sourceFile, option, { [sourceFilePath]: ['name'] });
  const terminateCircularResult = getTestValue(result);

  const expectation = {
    resolvedFilePath: posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
    resolvedDirPath: await getDirname(
      posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
    ),
    relativeFilePath: replaceSepToPosix(
      path.relative(
        env.exampleType03Path,
        posixJoin(env.exampleType03Path, 'popcorn', 'lawyer', 'appliance', 'bomb.ts'),
      ),
    ),
    depth: 4,
    starExported: false,
    defaultExport: { identifier: 'bomb' },
    namedExports: [{ identifier: 'bomb' }],
  };

  expect(terminateCircularResult).toEqual(expectation);
});

test('c004-getExportInfos-not-ignore', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const projectPath = env.exampleType03Path;
  const project = share.project03;

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    skipEmptyDir: false,
    keepFileExt: false,
    topDirDepth: 0,
    topDirs: [projectPath],
  };

  const result = await getExportInfos(project, option, {
    origin: {},
    evaluated: {},
  });
  const expectation = await import(path.join(__dirname, 'expects', expectFileName));
  const terminateCircularResult = getTestValue(result);

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c005-getExportInfos-partial-ignore', async () => {
  const expectFileName = expect
    .getState()
    .currentTestName.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts');

  const projectPath = env.exampleType04Path;
  const project = share.project04;

  const ignoreFiles = await getIgnoreConfigFiles(projectPath);
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
    topDirs: [projectPath],
  };

  const result = await getExportInfos(project, option, ignoreContents);
  const expectation = await import(path.join(__dirname, 'expects', expectFileName));
  const terminateCircularResult = getTestValue(result);

  expect(terminateCircularResult).toEqual(expectation.default);
});
