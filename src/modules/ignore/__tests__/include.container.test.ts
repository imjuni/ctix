import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { IncludeContainer } from '#/modules/ignore/IncludeContainer';
import { defaultIgnore } from '#/modules/ignore/defaultIgnore';
import { describe, expect, it } from '@jest/globals';
import { Glob } from 'glob';
import path from 'node:path';

describe('IncludeContainer', () => {
  it('getter', () => {
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts', 'src/compilers/**/*.ts', 'examples/**/*.ts'] },
    });

    expect(container.globs).toBeDefined();
  });

  it('isInclude - no glob files', () => {
    const container = new IncludeContainer({
      config: { include: [] },
    });

    const r01 = container.isInclude('src/files/IncludeContainer.ts');
    expect(r01).toBeFalsy();
  });

  it('isInclude', () => {
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts', 'src/compilers/**/*.ts', 'examples/**/*.ts'] },
    });

    const r01 = container.isInclude('src/files/IncludeContainer.ts');
    const r02 = container.isInclude('src/cli/builders/setCommandBundleOptions.ts');
    const r03 = container.isInclude(path.join(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isInclude(
      path.join(process.cwd(), 'src/cli/builders/setCommandBundleOptions.ts'),
    );

    expect(r01).toBeFalsy();
    expect(r02).toBeTruthy();
    expect(r03).toBeFalsy();
    expect(r04).toBeTruthy();
  });

  it('with exclusive glob isInclude', () => {
    const container = new IncludeContainer({
      config: {
        include: [
          'src/cli/**/*.ts',
          'src/compilers/**/*.ts',
          '!src/compilers/getTypeScriptProject.ts',
          'examples/**/*.ts',
        ],
      },
    });

    const r01 = container.isInclude('src/files/IncludeContainer.ts');
    const r02 = container.isInclude('src/cli/builders/setCommandBundleOptions.ts');
    const r03 = container.isInclude(path.join(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isInclude(
      path.join(process.cwd(), 'src/cli/builders/setCommandBundleOptions.ts'),
    );
    const r05 = container.isInclude(
      path.join(process.cwd(), 'src/cli/compilers/getTypeScriptProject.ts'),
    );

    expect(r01).toBeFalsy();
    expect(r02).toBeTruthy();
    expect(r03).toBeFalsy();
    expect(r04).toBeTruthy();
    expect(r05).toBeFalsy();
  });

  it('files - string path', () => {
    const expactation = getGlobFiles(
      new Glob('example/type03/**/*.ts', {
        ignore: defaultIgnore,
        cwd: process.cwd(),
      }),
    );
    const container = new IncludeContainer({
      config: { include: ['example/type03/**/*.ts'] },
    });

    const r01 = container.files();

    expect(r01).toEqual(expactation);
  });
});
