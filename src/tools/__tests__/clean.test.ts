import { getCleanFilenames, clean } from '@tools/clean';
import debug from 'debug';
import * as TEI from 'fp-ts/Either';
import * as TTE from 'fp-ts/TaskEither';
import * as path from 'path';
import * as TFU from 'fp-ts/function';
import { defaultOption } from '@tools/cticonfig';

const log = debug('ctix:file-test');

const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType04Path = path.join(exampleRootPath, 'type04');

describe('cti-clean-test', () => {
  test('get-clean-filenames', async () => {
    const files = await getCleanFilenames({
      cliOption: { ...defaultOption(), project: path.join(exampleType04Path, 'tsconfig.json') },
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
        cliOption: { ...defaultOption(), project: path.join(exampleType04Path, 'tsconfig.json') },
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
