import { getCtiConfig, getMergedConfig } from '@tools/cticonfig';
import { getIgnoredContents, getIgnoreFileContents, getIgnoreFiles } from '@tools/ctiignore';
import {
  getTypeScriptConfig,
  getTypeScriptExportStatement,
  getTypeScriptSource,
} from '@tools/tsfiles';
import { taskEitherLiftor } from '@tools/typehelper';
import debug from 'debug';
import * as TE from 'fp-ts/Either';
import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/pipeable';
import * as TTE from 'fp-ts/TaskEither';
import * as path from 'path';
import { getWriteContents, write } from '../write';

const log = debug('ctit:file-test');

const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType04Path = path.join(exampleRootPath, 'type04');

describe('cti-write-test-set', () => {
  test('get-create-write-content', async () => {
    const liftedGetIgnoreFiles = taskEitherLiftor(getIgnoreFiles);
    const liftedGetIgnoreFileContents = taskEitherLiftor(getIgnoreFileContents);
    const liftedGetIgnoredContents = taskEitherLiftor(getIgnoredContents);
    const liftedGetTypeScriptConfig = taskEitherLiftor(getTypeScriptConfig);

    const configWithIgnored = await sequenceT(TTE.taskEither)(
      pipe(
        liftedGetIgnoreFiles(exampleType04Path),
        TTE.chain(liftedGetIgnoreFileContents),
        TTE.chain(liftedGetIgnoredContents),
      ),
      liftedGetTypeScriptConfig({
        cwd: exampleType04Path,
        tsconfigPath: path.join(exampleType04Path, 'tsconfig.json'),
      }),
      pipe(
        taskEitherLiftor(getCtiConfig)({ cwd: exampleType04Path }),
        TTE.chain((args) => () =>
          getMergedConfig({ cwd: exampleType04Path, configObjects: args }),
        ),
      ),
    )();

    if (TE.isLeft(configWithIgnored)) {
      return expect(TE.isLeft(configWithIgnored)).toBeFalsy();
    }

    const [ignores, tsconfig, configObjects] = configWithIgnored.right;

    const exportContents = await pipe(
      taskEitherLiftor(getTypeScriptSource)({
        tsconfig,
        ignores: ignores.ignores,
      }),
      TTE.chain((args) => () =>
        getTypeScriptExportStatement({
          program: args.program,
          filenames: args.filenames,
        }),
      ),
    )();

    if (TE.isLeft(exportContents)) {
      return expect(TE.isLeft(exportContents)).toBeFalsy();
    }

    const writed = await getWriteContents({ ...exportContents.right, configObjects });

    if (TE.isLeft(writed)) {
      return expect(TE.isLeft(writed)).toBeFalsy();
    }

    log('successful result: ', writed.right);

    expect(writed.right.sort()).toEqual(
      [
        {
          pathname: exampleType04Path,
          content: [
            "export * from './BubbleCls.tsx'",
            "export * from './ComparisonCls.tsx'",
            "export * from './HandsomelyCls.tsx'",
            "export * from './SampleCls.tsx'",
            "export * from './createTypeScriptIndex'",
            "export * from './index.tsx'",
            "export * from './wellmade'",
            "export { default as index } from './index.tsx'",
          ],
        },
        {
          pathname: path.join(exampleType04Path, '/wellmade'),
          content: ["export * from './WhisperingCls'", "export * from './carpenter'"],
        },
        {
          pathname: path.join(exampleType04Path, '/wellmade/carpenter'),
          content: ["export * from './DiscussionCls'", "export * from './MakeshiftCls'"],
        },
      ].sort(),
    );
  });

  test('get-write-content', async () => {
    const liftedGetIgnoreFiles = taskEitherLiftor(getIgnoreFiles);
    const liftedGetIgnoreFileContents = taskEitherLiftor(getIgnoreFileContents);
    const liftedGetIgnoredContents = taskEitherLiftor(getIgnoredContents);
    const liftedGetTypeScriptConfig = taskEitherLiftor(getTypeScriptConfig);

    const configWithIgnored = await sequenceT(TTE.taskEither)(
      pipe(
        liftedGetIgnoreFiles(exampleType04Path),
        TTE.chain(liftedGetIgnoreFileContents),
        TTE.chain(liftedGetIgnoredContents),
      ),
      liftedGetTypeScriptConfig({
        cwd: exampleType04Path,
        tsconfigPath: path.join(exampleType04Path, 'tsconfig.json'),
      }),
      pipe(
        taskEitherLiftor(getCtiConfig)({ cwd: exampleType04Path }),
        TTE.chain((args) => () =>
          getMergedConfig({ cwd: exampleType04Path, configObjects: args }),
        ),
      ),
    )();

    if (TE.isLeft(configWithIgnored)) {
      return expect(TE.isLeft(configWithIgnored)).toBeFalsy();
    }

    const [ignores, tsconfig, configObjects] = configWithIgnored.right;

    const exportContents = await pipe(
      taskEitherLiftor(getTypeScriptSource)({
        tsconfig,
        ignores: ignores.ignores,
      }),
      TTE.chain((args) => () =>
        getTypeScriptExportStatement({
          program: args.program,
          filenames: args.filenames,
        }),
      ),
    )();

    if (TE.isLeft(exportContents)) {
      return expect(TE.isLeft(exportContents)).toBeFalsy();
    }

    const writed = await getWriteContents({ ...exportContents.right, configObjects });

    if (TE.isLeft(writed)) {
      return expect(TE.isLeft(writed)).toBeFalsy();
    }

    await write({ contents: writed.right, configObjects });
  });
});
