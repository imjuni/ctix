import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { posixJoin } from '#/modules/path/posixJoin';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob } from 'glob';
import { describe, expect, it } from 'vitest';

describe('getGlobFiles', () => {
  it('string filename', () => {
    const glob = new Glob('**/tsconfig.json', { cwd: process.cwd(), ignore: defaultExclude });
    const files = getGlobFiles(glob);

    expect(files).toEqual([
      'tsconfig.json',
      'example/type11/tsconfig.json',
      'example/type10/tsconfig.json',
      'example/type09/tsconfig.json',
      'example/type08/tsconfig.json',
      'example/type07/tsconfig.json',
      'example/type06/tsconfig.json',
      'example/type05/tsconfig.json',
      'example/type04/tsconfig.json',
      'example/type03/tsconfig.json',
      'example/type02/tsconfig.json',
      'example/type01/tsconfig.json',
    ]);
  });

  it('Paths filename', () => {
    const glob = new Glob('**/tsconfig.json', {
      cwd: process.cwd(),
      ignore: defaultExclude,
      withFileTypes: true,
    });
    const files = getGlobFiles(glob);

    expect(files).toEqual([
      posixJoin(process.cwd(), 'tsconfig.json'),
      posixJoin(process.cwd(), 'example/type11/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type10/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type09/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type08/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type07/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type06/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type05/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type04/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type03/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type02/tsconfig.json'),
      posixJoin(process.cwd(), 'example/type01/tsconfig.json'),
    ]);
  });
});
