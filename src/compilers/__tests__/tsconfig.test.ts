import { getFileScope } from '#/compilers/getFileScope';
import { getTypeScriptConfig } from '#/compilers/getTypeScriptConfig';
import { describe, expect, it } from '@jest/globals';
import path from 'node:path';

describe('getTypeScriptConfig', () => {
  it('reading pass', () => {
    const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.example.json');
    const config = getTypeScriptConfig(tsconfigPath);
    console.log(config);
    console.log(config.raw);
  });

  it('reading pass', () => {
    const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.empty.json');
    const config = getTypeScriptConfig(tsconfigPath);
    console.log(config.raw);
  });
});

describe('getFileScope', () => {
  it('empty scope', () => {
    const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.empty.json');
    const config = getTypeScriptConfig(tsconfigPath);
    const scopes = getFileScope(config.raw);

    expect(scopes).toMatchObject({ include: [], exclude: [] });
  });

  it('file scope', () => {
    const tsconfigPath = path.join(process.cwd(), 'example', 'tsconfig.for.test.json');
    const config = getTypeScriptConfig(tsconfigPath);
    const scopes = getFileScope(config.raw);

    expect(scopes).toMatchObject({
      include: ['src/**/*.ts'],
      exclude: ['example/**', 'dist/**', '**/erdia_eg', '**/.configs/**', '**/docs/**/*'],
    });
  });
});
