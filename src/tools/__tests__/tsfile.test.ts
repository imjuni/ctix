// tslint:disable no-console
import { getIgnoredContents, getIgnoreFileContents, getIgnoreFiles } from '@tools/ctiignore';
import {
  getTypeScriptConfig,
  getTypeScriptExportStatement,
  getTypeScriptSource,
} from '@tools/tsfiles';
import debug from 'debug';
import { sequenceT } from 'fp-ts/Apply';
import * as TEI from 'fp-ts/Either';
import * as TFU from 'fp-ts/function';
import * as TTE from 'fp-ts/TaskEither';
import * as path from 'path';

const log = debug('ctix:file-test');
const exampleRootPath = path.resolve(path.join(__dirname, '..', '..', '..', 'example'));
const exampleType04Path = path.join(exampleRootPath, 'type04');

describe('cti-tsfile-test', () => {
  test('get-tsconfig', async () => {
    const config = await getTypeScriptConfig({
      cwd: process.cwd(),
      tsconfigPath: 'tsconfig.json',
    })();

    if (TEI.isLeft(config)) {
      return expect(TEI.isLeft(config)).toBeFalsy();
    }

    return expect(config).toBeDefined();
  });

  test('get-type-script-export-statement', async () => {
    const configWithIgnored = await sequenceT(TTE.ApplicativeSeq)(
      TFU.pipe(
        getIgnoreFiles(exampleType04Path),
        TTE.chain(getIgnoreFileContents),
        TTE.chain(getIgnoredContents),
      ),
      getTypeScriptConfig({
        cwd: exampleType04Path,
        tsconfigPath: path.join(exampleType04Path, 'tsconfig.json'),
      }),
    )();

    if (TEI.isLeft(configWithIgnored)) {
      return expect(TEI.isLeft(configWithIgnored)).toBeFalsy();
    }

    const [ignores, tsconfig] = configWithIgnored.right;

    const program = await getTypeScriptSource({
      tsconfig,
      ignores: ignores.ignores,
    })();

    if (TEI.isLeft(program)) {
      return expect(TEI.isLeft(program)).toBeFalsy();
    }

    const statements = await getTypeScriptExportStatement({
      program: program.right.program,
      filenames: program.right.filenames,
    });

    log('detected statement: ', statements);

    if (TEI.isLeft(statements)) {
      return expect(TEI.isLeft(statements)).toBeFalsy();
    }

    return expect(statements.right).toEqual({
      program: program.right.program,
      exportFilenames: [
        path.join(exampleType04Path, 'BubbleCls.tsx'),
        path.join(exampleType04Path, 'ComparisonCls.tsx'),
        path.join(exampleType04Path, 'HandsomelyCls.tsx'),
        path.join(exampleType04Path, 'SampleCls.tsx'),
        path.join(exampleType04Path, 'createTypeScriptIndex.d.ts'),
        path.join(exampleType04Path, 'index.tsx'),
        path.join(exampleType04Path, 'SampleEnum.ts'),
        path.join(exampleType04Path, 'wellmade/WhisperingCls.ts'),
        path.join(exampleType04Path, 'wellmade/carpenter/DiscussionCls.ts'),
        path.join(exampleType04Path, 'wellmade/carpenter/MakeshiftCls.ts'),
      ].sort((left, right) => left.localeCompare(right)),
      defaultExportFilenames: [
        path.join(exampleType04Path, 'index.tsx'),
        path.join(exampleType04Path, 'SampleEnum.ts'),
      ],
    });
  });
});
