import debug from 'debug';
import * as path from 'path';
import { getIgnoreFiles, getIgnoreFileContents, getIgnoredContents } from '@tools/ctiignore';
import * as TE from 'fp-ts/lib/Either';

const log = debug('ctit:file-test');
const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType04Path = path.join(exampleRootPath, 'type04');

describe('cti-ignore-test', () => {
  test('get-ignore', async () => {
    const files = await getIgnoreFiles(exampleType04Path);

    if (TE.isLeft(files)) {
      return expect(TE.isLeft(files)).toBeFalsy();
    }

    log('Result: ', files.right);

    return expect(files.right).toEqual({
      cwd: exampleType04Path,
      filenames: [
        path.join(exampleType04Path, '.ctiignore'),
        path.join(exampleType04Path, 'wellmade/.ctiignore'),
      ],
    });
  });

  test('get-ignore-content', async () => {
    const files = await getIgnoreFileContents({
      cwd: exampleType04Path,
      filenames: [
        path.join(exampleType04Path, '.ctiignore'),
        path.join(exampleType04Path, 'wellmade/.ctiignore'),
      ],
    });

    if (TE.isLeft(files)) {
      return expect(TE.isLeft(files)).toBeFalsy();
    }

    log('Result: ', files.right.ignores);

    return expect(files.right).toEqual({
      cwd: exampleType04Path,
      ignores: [
        {
          filename: path.join(exampleType04Path, '.ctiignore'),
          directory: exampleType04Path,
          content: ['juvenile/**'],
        },
        {
          filename: path.join(exampleType04Path, 'wellmade/.ctiignore'),
          directory: path.join(exampleType04Path, 'wellmade'),
          content: ['ChildlikeCls.ts', 'FlakyCls.ts'],
        },
      ],
    });
  });

  test('get-ignore-contents', async () => {
    const contents = await getIgnoredContents({
      cwd: exampleType04Path,
      ignores: [
        {
          filename: path.join(exampleType04Path, '.ctiignore'),
          directory: exampleType04Path,
          content: ['juvenile/**'],
        },
        {
          filename: path.join(exampleType04Path, 'wellmade/.ctiignore'),
          directory: path.join(exampleType04Path, 'wellmade'),
          content: ['ChildlikeCls.ts', 'FlakyCls.ts'],
        },
      ],
    });

    log('Result: ', contents);

    expect(contents).toBeDefined();
  });
});
