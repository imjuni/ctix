import getExportInfos from '@compilers/getExportInfos';
import { TCreateOptionWithDirInfo } from '@configs/interfaces/IOption';
import * as env from '@testenv/env';
import { getTestValue, posixJoin } from '@tools/misc';
import validateExportDuplication from '@validations/validateExportDuplication';
import validateFileNameDuplication from '@validations/validateFileNameDuplication';
import consola, { LogLevel } from 'consola';
import fastGlob from 'fast-glob';
import { replaceSepToPosix } from 'my-node-fp';
import path from 'path';
import * as tsm from 'ts-morph';

const share: { projectPath: string; project: tsm.Project } = {} as any;

beforeAll(() => {
  consola.level = LogLevel.Debug;
  share.projectPath = replaceSepToPosix(path.join(env.examplePath, 'tsconfig.json'));
  share.project = new tsm.Project({ tsConfigFilePath: share.projectPath });
});

test('c001-validateExportDuplication', async () => {
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

  const ignores = files.reduce<Record<string, string | string[]>>((aggregation, file) => {
    return { ...aggregation, [file]: '*' };
  }, {});

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    topDirDepth: 0,
    topDirs: [env.exampleType03Path],
  };

  const exportInfos = await getExportInfos(share.project, option, ignores);
  const result = validateExportDuplication(exportInfos);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));
  const terminateCircularResult = getTestValue(result);

  expect(terminateCircularResult).toEqual(expectation.default);
});

test('c002-validateFileNameDuplication', async () => {
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

  const ignores = files.reduce<Record<string, string | string[]>>((aggregation, file) => {
    return { ...aggregation, [file]: '*' };
  }, {});

  const option: TCreateOptionWithDirInfo = {
    ...env.createOptionWithDirInfo,
    topDirDepth: 0,
    topDirs: [env.exampleType03Path],
  };

  const exportInfos = await getExportInfos(share.project, option, ignores);
  const result = validateFileNameDuplication(exportInfos, option);
  const terminateCircularResult = getTestValue(result);

  const expectation = await import(path.join(__dirname, 'expects', expectFileName));

  expect(terminateCircularResult).toEqual(expectation.default);
});
