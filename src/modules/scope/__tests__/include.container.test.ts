import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { IncludeContainer } from '#/modules/scope/IncludeContainer';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob } from 'glob';
import { describe, expect, it } from 'vitest';

describe('IncludeContainer', () => {
  it('getter', () => {
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts', 'src/compilers/**/*.ts', 'examples/**/*.ts'] },
      cwd: process.cwd(),
    });

    expect(container.globs).toBeDefined();
    expect(container.map).toBeDefined();
  });

  it('isInclude - no glob files', () => {
    const container = new IncludeContainer({
      config: { include: [] },
      cwd: process.cwd(),
    });

    const r01 = container.isInclude('src/files/IncludeContainer.ts');
    expect(r01).toBeFalsy();
  });

  it('isInclude', () => {
    const container = new IncludeContainer({
      config: { include: ['src/cli/**/*.ts', 'src/compilers/**/*.ts', 'examples/**/*.ts'] },
      cwd: process.cwd(),
    });

    const r01 = container.isInclude('src/files/IncludeContainer.ts');
    const r02 = container.isInclude('src/cli/builders/setModeBundleOptions.ts');
    const r03 = container.isInclude(posixJoin(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isInclude(
      posixJoin(process.cwd(), 'src/cli/builders/setModeBundleOptions.ts'),
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
      cwd: process.cwd(),
    });

    const r01 = container.isInclude('src/files/IncludeContainer.ts');
    const r02 = container.isInclude('src/cli/builders/setModeBundleOptions.ts');
    const r03 = container.isInclude(posixJoin(process.cwd(), 'src/files/IncludeContainer.ts'));
    const r04 = container.isInclude(
      posixJoin(process.cwd(), 'src/cli/builders/setModeBundleOptions.ts'),
    );
    const r05 = container.isInclude(
      posixJoin(process.cwd(), 'src/cli/compilers/getTypeScriptProject.ts'),
    );

    expect(r01).toBeFalsy();
    expect(r02).toBeTruthy();
    expect(r03).toBeFalsy();
    expect(r04).toBeTruthy();
    expect(r05).toBeFalsy();
  });

  it('files - string path', () => {
    const expactation = getGlobFiles(
      new Glob('examples/type03/**/*.ts', {
        ignore: defaultExclude,
        cwd: process.cwd(),
        absolute: true,
      }),
    );
    const container = new IncludeContainer({
      config: { include: ['examples/type03/**/*.ts'] },
      cwd: process.cwd(),
    });

    const r01 = container.files();

    expect(r01).toEqual(expactation);
  });
});
