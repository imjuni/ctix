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

describe('cti-clean-test', () => {
  beforeAll(async () => {
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
      throw new Error('configure load fail');
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
      throw new Error('exportContents load fails');
    }

    const writeContents = await getWriteContents({
      ...exportContents.right,
      optionObjects: configObjects,
    });

    if (TEI.isLeft(writeContents)) {
      throw new Error('writeContents load fails');
    }

    await write({
      contents: writeContents.right,
      optionObjects: configObjects,
    });
  });

  test('get-clean-filenames', async () => {
    const files = await getCleanFilenames({
      cliOption: {
        ...defaultOption(),
        project: path.join(exampleType04Path, 'tsconfig.json'),
        resolvedProjectDirPath: path.resolve(exampleType04Path),
        resolvedProjectFilePath: path.resolve(path.join(exampleType04Path, 'tsconfig.json')),
      },
    })();

    if (TEI.isLeft(files)) {
      return expect(TEI.isLeft(files)).toBeFalsy();
    }

    log('Result: ', files.right);

    const withoutBackup = [
      path.join(exampleType04Path, 'index.ts'),
      path.join(exampleType04Path, 'wellmade', 'index.ts'),
      path.join(exampleType04Path, 'wellmade', 'carpenter', 'index.ts'),
    ];

    const withBackup = [
      path.join(exampleType04Path, 'index.ts'),
      path.join(exampleType04Path, 'index.ts.bak'),
      path.join(exampleType04Path, 'wellmade', 'index.ts'),
      path.join(exampleType04Path, 'wellmade', 'index.ts.bak'),
      path.join(exampleType04Path, 'wellmade', 'carpenter', 'index.ts'),
      path.join(exampleType04Path, 'wellmade', 'carpenter', 'index.ts.bak'),
    ];

    return files.right.length < withBackup.length
      ? expect(files.right).toEqual(withoutBackup)
      : expect(files.right).toEqual(withBackup);
  });

  test('do-clean', async () => {
    const files = await TFU.pipe(
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

    if (TEI.isLeft(files)) {
      return expect(TEI.isLeft(files)).toBeFalsy();
    }

    log('Result: ', files.right);

    return expect(files.right).toEqual(true);
  });
});
