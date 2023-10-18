import { getExportInfos } from '#/compilers/getExportInfos';
import { tsMorphProjectOption } from '#/compilers/tsMorphProjectOption';
import { defaultIgnoreFileName } from '#/configs/defaultIgnoreFileName';
import type { TCreateOptionWithDirInfo } from '#/configs/interfaces/IOption';
import { getIgnoreConfigContents } from '#/ignores/getIgnoreConfigContents';
import { getIgnoreConfigFiles } from '#/ignores/getIgnoreConfigFiles';
import * as env from '#/testenv/env';
import { getTestValue, posixJoin } from '#/tools/misc';
import { validateExportDuplication } from '#/validations/validateExportDuplication';
import { validateFileNameDuplication } from '#/validations/validateFileNameDuplication';
import path from 'path';
import * as tsm from 'ts-morph';

const share: {
  projectPath03: string;
  project03: tsm.Project;
} = {} as any;

beforeAll(() => {
  share.projectPath03 = posixJoin(env.exampleType03Path, 'tsconfig.json');
  share.project03 = new tsm.Project({
    tsConfigFilePath: share.projectPath03,
    ...tsMorphProjectOption,
  });
});

test('c001-validateExportDuplication', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const project = share.project03;

  const ignoreFiles = await getIgnoreConfigFiles(projectPath, defaultIgnoreFileName);
  const ignoreContents = await getIgnoreConfigContents({ cwd: projectPath, ...ignoreFiles });

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    project: projectPath,
    topDirDepth: 0,
    startAt: projectPath,
    topDirs: [projectPath],
  };

  const exportInfos = await getExportInfos(project, option, ignoreContents);
  const result = validateExportDuplication(exportInfos);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));
  const terminateCircularResult = getTestValue(result);

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c002-validateFileNameDuplication', async () => {
  const expectFileName =
    expect.getState().currentTestName?.replace(/^([cC][0-9]+)(-.+)/, 'expect$2.ts') ?? '';

  const projectPath = env.exampleType03Path;
  const project = share.project03;

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
    topDirDepth: 0,
    topDirs: [env.exampleType03Path],
  };

  const exportInfos = await getExportInfos(project, option, ignoreContents);
  const result = validateFileNameDuplication(exportInfos, option);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});
