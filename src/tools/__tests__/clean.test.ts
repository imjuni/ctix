import { getCleanFilenames, clean } from '@tools/clean';
import debug from 'debug';
import * as TEI from 'fp-ts/Either';
import * as TTE from 'fp-ts/TaskEither';
import * as path from 'path';
import * as TPI from 'fp-ts/lib/pipeable';

const log = debug('ctix:file-test');
const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType04Path = path.join(exampleRootPath, 'type04');

describe('cti-clean-test', () => {
  test('get-clean-filenames', async () => {
    const files = await getCleanFilenames({
      project: path.join(exampleType04Path, 'tsconfig.json'),
    });

    if (TEI.isLeft(files)) {
      return expect(TEI.isLeft(files)).toBeFalsy();
    }

    log('Result: ', files.right);

    return expect(files.right).toEqual([
      path.join(exampleType04Path, 'index.ts'),
      path.join(exampleType04Path, 'wellmade/index.ts'),
      path.join(exampleType04Path, 'wellmade/carpenter/index.ts'),
    ]);
  });

  test('do-clean', async () => {
    const files = await TPI.pipe(
      () =>
        getCleanFilenames({
          project: path.join(exampleType04Path, 'tsconfig.json'),
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
