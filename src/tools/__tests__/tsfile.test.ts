// tslint:disable no-console
import { getIgnoredContents, getIgnoreFileContents, getIgnoreFiles } from '@tools/ctiignore';
import { getTypeScriptConfig, getTypeScriptExportStatement, getTypeScriptSource } from '@tools/tsfiles';
import { taskEitherLiftor } from '@tools/typehelper';
import debug from 'debug';
import { sequenceT } from 'fp-ts/lib/Apply';
import * as TE from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TTE from 'fp-ts/lib/TaskEither';
import * as path from 'path';

const log = debug('ctix:file-test');
const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType04Path = path.join(exampleRootPath, 'type04');

describe('cti-tsfile-test', () => {
  test('get-tsconfig', async () => {
    const config = await getTypeScriptConfig({
      cwd: process.cwd(),
      tsconfigPath: 'tsconfig.json',
    });

    if (TE.isLeft(config)) {
      return expect(TE.isLeft(config)).toBeFalsy();
    }

    return expect(config).toBeDefined();
  });

  test('get-type-script-export-statement', async () => {
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
    )();

    if (TE.isLeft(configWithIgnored)) {
      return expect(TE.isLeft(configWithIgnored)).toBeFalsy();
    }

    const [ignores, tsconfig] = configWithIgnored.right;

    const program = await getTypeScriptSource({
      tsconfig,
      ignores: ignores.ignores,
    });

    if (TE.isLeft(program)) {
      return expect(TE.isLeft(program)).toBeFalsy();
    }

    const statements = await getTypeScriptExportStatement({
      program: program.right.program,
      filenames: program.right.filenames,
    });

    log('detected statement: ', statements);

    if (TE.isLeft(statements)) {
      return expect(TE.isLeft(statements)).toBeFalsy();
    }

    return expect(statements.right).toEqual({
      exportFilenames: [
        path.join(exampleType04Path, 'BubbleCls.tsx'),
        path.join(exampleType04Path, 'ComparisonCls.tsx'),
        path.join(exampleType04Path, 'HandsomelyCls.tsx'),
        path.join(exampleType04Path, 'SampleCls.tsx'),
        path.join(exampleType04Path, 'createTypeScriptIndex.d.ts'),
        path.join(exampleType04Path, 'index.tsx'),
        path.join(exampleType04Path, 'wellmade/WhisperingCls.ts'),
        path.join(exampleType04Path, 'wellmade/carpenter/DiscussionCls.ts'),
        path.join(exampleType04Path, 'wellmade/carpenter/MakeshiftCls.ts'),
      ].sort((left, right) => left.localeCompare(right)),
      defaultExportFilenames: [path.join(exampleType04Path, 'index.tsx')],
    });
  });
});
