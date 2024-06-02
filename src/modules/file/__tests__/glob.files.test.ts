import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { defaultExclude } from '#/modules/scope/defaultExclude';
import { Glob } from 'glob';
import { describe, expect, it } from 'vitest';

describe('getGlobFiles', () => {
  it('string filename', () => {
    const glob = new Glob('**/tsconfig.json', { cwd: process.cwd(), ignore: defaultExclude });
    const files = getGlobFiles(glob);

    expect(files).toEqual([
      'tsconfig.json',
      'examples/type12/tsconfig.json',
      'examples/type11/tsconfig.json',
      'examples/type10/tsconfig.json',
      'examples/type09/tsconfig.json',
      'examples/type08/tsconfig.json',
      'examples/type07/tsconfig.json',
      'examples/type06/tsconfig.json',
      'examples/type05/tsconfig.json',
      'examples/type04/tsconfig.json',
      'examples/type03/tsconfig.json',
      'examples/type02/tsconfig.json',
      'examples/type01/tsconfig.json',
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
      posixJoin(process.cwd(), 'examples/type12/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type11/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type10/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type09/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type08/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type07/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type06/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type05/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type04/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type03/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type02/tsconfig.json'),
      posixJoin(process.cwd(), 'examples/type01/tsconfig.json'),
    ]);
  });
});
