import { clean, getCleanFilenames } from '@tools/clean';
import { defaultOption, getCTIXOptions, getMergedConfig } from '@tools/cticonfig';
import { getIgnoredContents, getIgnoreFileContents, getIgnoreFiles } from '@tools/ctiignore';
import {
  getTypeScriptConfig,
  getTypeScriptExportStatement,
  getTypeScriptSource,
} from '@tools/tsfiles';
import debug from 'debug';
import * as TAP from 'fp-ts/Apply';
import * as TEI from 'fp-ts/Either';
import * as TFU from 'fp-ts/function';
import * as TTE from 'fp-ts/TaskEither';
import * as path from 'path';
import { getWriteContents, write } from '../write';

const log = debug('ctix:file-test');

const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType04Path = path.join(exampleRootPath, 'type04');

describe('cti-write-test-set', () => {
  afterEach(async (): Promise<void> => {
    await TFU.pipe(
      getCleanFilenames({
        cliOption: {
          ...defaultOption(),
          project: path.join(exampleType04Path, 'tsconfig.json'),
          resolvedProjectDirPath: path.resolve(exampleType04Path),
          resolvedProjectFilePath: path.resolve(path.join(exampleType04Path, 'tsconfig.json')),
        },
      }),
      TTE.chain((args) => () => clean({ filenames: args })),
    )();
  });

  test('get-create-write-content', async (): Promise<void> => {
    const configWithIgnored = await TAP.sequenceT(TTE.ApplicativeSeq)(
      TFU.pipe(
        getIgnoreFiles(exampleType04Path),
        TTE.chain(getIgnoreFileContents),
        TTE.chain(getIgnoredContents),
      ),
      getTypeScriptConfig({
        tsconfigPath: path.join(exampleType04Path, 'tsconfig.json'),
      }),
      TFU.pipe(
        getCTIXOptions({ projectPath: exampleType04Path }),
        TTE.chain((args) =>
          getMergedConfig({
            projectPath: exampleType04Path,
            cliOption: defaultOption(),
            optionObjects: args,
          }),
        ),
      ),
    )();

    if (TEI.isLeft(configWithIgnored)) {
      return expect(TEI.isLeft(configWithIgnored)).toBeFalsy();
    }

    const [ignores, tsconfig, configObjects] = configWithIgnored.right;

    const exportContents = await TFU.pipe(
      getTypeScriptSource({
        tsconfig,
        ignores: ignores.ignores,
      }),
      TTE.chain(
        (args) => () =>
          getTypeScriptExportStatement({
            program: args.program,
            filenames: args.filenames,
          }),
      ),
    )();

    if (TEI.isLeft(exportContents)) {
      return expect(TEI.isLeft(exportContents)).toBeFalsy();
    }

    const writed = await getWriteContents({
      ...exportContents.right,
      optionObjects: configObjects,
    });

    if (TEI.isLeft(writed)) {
      return expect(TEI.isLeft(writed)).toBeFalsy();
    }

    log('successful result: ', writed.right);

    return expect(writed.right.sort()).toEqual(
      [
        {
          pathname: exampleType04Path,
          content: [
            "export * from './BubbleCls'",
            "export * from './ComparisonCls'",
            "export * from './createTypeScriptIndex'",
            "export * from './HandsomelyCls'",
            "export * from './index.tsx'",
            "export * from './SampleCls'",
            "export * from './SampleEnum'",
            "export { default as index } from './index.tsx'",
            "export { default as sampleEnum } from './SampleEnum'",
            "export * from './xylophone'",
            "export * from './wellmade'",
          ],
        },
        {
          pathname: path.join(exampleType04Path, 'wellmade'),
          content: [
            "export * from './WhisperingCls'",
            "export * from './carpenter'"
          ],
        },
        {
          pathname: path.join(exampleType04Path, 'wellmade', 'carpenter'),
          content: [
            "export * from './DiscussionCls'",
            "export * from './MakeshiftCls'"
          ],
        },
        {
          pathname: path.join(exampleType04Path, 'xylophone'),
          content: [
            "export * from './yellow'",
          ],
        },
        {
          pathname: path.join(exampleType04Path, 'xylophone', 'yellow'),
          content: [
            "export * from './zoo'",
          ],
        },
        {
          pathname: path.join(exampleType04Path, 'xylophone', 'yellow', 'zoo'),
          content: [
            "export * from './ZooCls'",
          ],
        },
      ].sort(),
    );
  });

  test('get-write-content', async () => {
    const configWithIgnored = await TAP.sequenceT(TTE.ApplicativeSeq)(
      TFU.pipe(
        getIgnoreFiles(exampleType04Path),
        TTE.chain(getIgnoreFileContents),
        TTE.chain(getIgnoredContents),
      ),
      getTypeScriptConfig({
        tsconfigPath: path.join(exampleType04Path, 'tsconfig.json'),
      }),
      TFU.pipe(
        getCTIXOptions({ projectPath: exampleType04Path }),
        TTE.chain((args) =>
          getMergedConfig({
            projectPath: exampleType04Path,
            cliOption: defaultOption(),
            optionObjects: args,
          }),
        ),
      ),
    )();

    if (TEI.isLeft(configWithIgnored)) {
      return expect(TEI.isLeft(configWithIgnored)).toBeFalsy();
    }

    const [ignores, tsconfig, configObjects] = configWithIgnored.right;

    const exportContents = await TFU.pipe(
      getTypeScriptSource({
        tsconfig,
        ignores: ignores.ignores,
      }),
      TTE.chain(
        (args) => () =>
          getTypeScriptExportStatement({
            program: args.program,
            filenames: args.filenames,
          }),
      ),
    )();

    if (TEI.isLeft(exportContents)) {
      return expect(TEI.isLeft(exportContents)).toBeFalsy();
    }

    const writed = await getWriteContents({
      ...exportContents.right,
      optionObjects: configObjects,
    });

    if (TEI.isLeft(writed)) {
      return expect(TEI.isLeft(writed)).toBeFalsy();
    }

    const writedEither = await write({ contents: writed.right, optionObjects: configObjects });

    if (TEI.isLeft(writedEither)) {
      return expect(TEI.isLeft(writedEither)).toBeFalsy();
    }

    return expect(writedEither.right).toBeTruthy();
  });
});
