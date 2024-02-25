import { getFileScope } from '#/compilers/getFileScope';
import { getTypeScriptConfig } from '#/compilers/getTypeScriptConfig';
import { posixJoin } from '#/modules/path/modules/posixJoin';
import { describe, expect, it } from 'vitest';

describe('getTypeScriptConfig', () => {
  it('reading pass', () => {
    const tsconfigPath = posixJoin(process.cwd(), 'example', 'tsconfig.example.json');
    const config = getTypeScriptConfig(tsconfigPath);
    console.log(config);
    console.log(config.raw);
  });

  it('reading pass', () => {
    const tsconfigPath = posixJoin(process.cwd(), 'example', 'tsconfig.empty.json');
    const config = getTypeScriptConfig(tsconfigPath);
    console.log(config.raw);
  });
});

describe('getFileScope', () => {
  it('empty scope', () => {
    const tsconfigPath = posixJoin(process.cwd(), 'example', 'tsconfig.empty.json');
    const config = getTypeScriptConfig(tsconfigPath);
    const scopes = getFileScope(config.raw);

    expect(scopes).toMatchObject({ include: [], exclude: [] });
  });

  it('file scope', () => {
    const tsconfigPath = posixJoin(process.cwd(), 'example', 'tsconfig.for.test.json');
    const config = getTypeScriptConfig(tsconfigPath);
    const scopes = getFileScope(config.raw);

    expect(scopes).toMatchObject({
      include: ['src/**/*.ts'],
      exclude: ['example/**', 'dist/**', '**/erdia_eg', '**/.configs/**', '**/docs/**/*'],
    });
  });
});
