import { getGlobFiles } from '#/modules/file/getGlobFiles';
import { defaultIgnore } from '#/modules/ignore/defaultIgnore';
import { describe, expect, it } from '@jest/globals';
import { Glob } from 'glob';
import path from 'node:path';

describe('getGlobFiles', () => {
  it('string filename', () => {
    const glob = new Glob('**/tsconfig.json', { cwd: process.cwd(), ignore: defaultIgnore });
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
      ignore: defaultIgnore,
      withFileTypes: true,
    });
    const files = getGlobFiles(glob);

    expect(files).toEqual([
      path.join(process.cwd(), 'tsconfig.json'),
      path.join(process.cwd(), 'example/type11/tsconfig.json'),
      path.join(process.cwd(), 'example/type10/tsconfig.json'),
      path.join(process.cwd(), 'example/type09/tsconfig.json'),
      path.join(process.cwd(), 'example/type08/tsconfig.json'),
      path.join(process.cwd(), 'example/type07/tsconfig.json'),
      path.join(process.cwd(), 'example/type06/tsconfig.json'),
      path.join(process.cwd(), 'example/type05/tsconfig.json'),
      path.join(process.cwd(), 'example/type04/tsconfig.json'),
      path.join(process.cwd(), 'example/type03/tsconfig.json'),
      path.join(process.cwd(), 'example/type02/tsconfig.json'),
      path.join(process.cwd(), 'example/type01/tsconfig.json'),
    ]);
  });
});
