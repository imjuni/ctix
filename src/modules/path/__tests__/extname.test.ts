import { CE_EXTENSION_PROCESSING } from '#/configs/const-enum/CE_EXTENSION_PROCESSING';
import { addExt } from '#/modules/path/addExt';
import { getExtname } from '#/modules/path/getExtname';
import { getImportStatementExtname } from '#/modules/path/getImportStatementExtname';
import { getImportStatementRemoveExtname } from '#/modules/path/getImportStatementRemoveExtname';
import { getImportStatementReplaceJs } from '#/modules/path/getImportStatementReplaceJs';
import { describe, expect, it } from 'vitest';

describe('getImportStatementReplaceJs', () => {
  it('everything test', () => {
    const r01 = getImportStatementReplaceJs('.ts');
    const r02 = getImportStatementReplaceJs('.tsx');
    const r03 = getImportStatementReplaceJs('.jsx');
    const r04 = getImportStatementReplaceJs('.d.ts');
    const r05 = getImportStatementReplaceJs('.d.cts');
    const r06 = getImportStatementReplaceJs('.d.mts');
    const r07 = getImportStatementReplaceJs('.cts');
    const r08 = getImportStatementReplaceJs('.cjs');
    const r09 = getImportStatementReplaceJs('.mts');
    const r10 = getImportStatementReplaceJs('.mjs');
    const r11 = getImportStatementReplaceJs('.json');

    expect(r01).toEqual('.js');
    expect(r02).toEqual('.jsx');
    expect(r03).toEqual('.jsx');
    expect(r04).toEqual('.d.ts');
    expect(r05).toEqual('.d.cts');
    expect(r06).toEqual('.d.mts');
    expect(r07).toEqual('.cjs');
    expect(r08).toEqual('.cjs');
    expect(r09).toEqual('.mjs');
    expect(r10).toEqual('.mjs');
    expect(r11).toEqual('.json');
  });
});

describe('getImportStatementRemoveExtname', () => {
  it('everything test', () => {
    const r01 = getImportStatementRemoveExtname('.ts');
    const r02 = getImportStatementRemoveExtname('.tsx');
    const r03 = getImportStatementRemoveExtname('.jsx');
    const r04 = getImportStatementRemoveExtname('.d.ts');
    const r05 = getImportStatementRemoveExtname('.d.cts');
    const r06 = getImportStatementRemoveExtname('.d.mts');
    const r07 = getImportStatementRemoveExtname('.cts');
    const r08 = getImportStatementRemoveExtname('.cjs');
    const r09 = getImportStatementRemoveExtname('.mts');
    const r10 = getImportStatementRemoveExtname('.mjs');
    const r11 = getImportStatementRemoveExtname('.json');

    expect(r01).toEqual('');
    expect(r02).toEqual('');
    expect(r03).toEqual('');
    expect(r04).toEqual('.d.ts');
    expect(r05).toEqual('.d.cts');
    expect(r06).toEqual('.d.mts');
    expect(r07).toEqual('');
    expect(r08).toEqual('');
    expect(r09).toEqual('');
    expect(r10).toEqual('');
    expect(r11).toEqual('');
  });
});

describe('getImportStatementExtname', () => {
  it('remove extension: for commonjs', () => {
    const r01 = getImportStatementExtname(CE_EXTENSION_PROCESSING.NOT_EXTENSION, '.ts');
    const r02 = getImportStatementExtname(CE_EXTENSION_PROCESSING.NOT_EXTENSION, '.d.ts');
    const r03 = getImportStatementExtname(CE_EXTENSION_PROCESSING.NOT_EXTENSION, '.cts');

    expect(r01).toEqual('');
    expect(r02).toEqual('.d.ts');
    expect(r03).toEqual('');
  });

  it('keep extension', () => {
    const r01 = getImportStatementExtname(CE_EXTENSION_PROCESSING.KEEP_EXTENSION, '.ts');
    const r02 = getImportStatementExtname(CE_EXTENSION_PROCESSING.KEEP_EXTENSION, '.d.ts');

    expect(r01).toEqual('.ts');
    expect(r02).toEqual('.d.ts');
  });

  it('replace extension: for esm', () => {
    const r01 = getImportStatementExtname(CE_EXTENSION_PROCESSING.REPLACE_JS, '.ts');
    const r02 = getImportStatementExtname(CE_EXTENSION_PROCESSING.REPLACE_JS, '.d.ts');
    const r03 = getImportStatementExtname(CE_EXTENSION_PROCESSING.REPLACE_JS, '.cts');

    expect(r01).toEqual('.js');
    expect(r02).toEqual('.d.ts');
    expect(r03).toEqual('.cjs');
  });
});

describe('getExtname', () => {
  it('file extensions not included in extensions.ts', () => {
    const r01 = getExtname('test.js');
    expect(r01).toEqual('.js');
  });

  it('declaration files', () => {
    const r01 = getExtname('test.d.ts');
    const r02 = getExtname('test.d.cts');
    const r03 = getExtname('test.d.mts');

    expect(r01).toEqual('.d.ts');
    expect(r02).toEqual('.d.cts');
    expect(r03).toEqual('.d.mts');
  });

  it('file extensions included in extensions.ts', () => {
    const r01 = getExtname('test.ts');
    const r02 = getExtname('test.cts');
    const r03 = getExtname('test.mts');
    const r04 = getExtname('test.tsx');

    expect(r01).toEqual('.ts');
    expect(r02).toEqual('.cts');
    expect(r03).toEqual('.mts');
    expect(r04).toEqual('.tsx');
  });
});

describe('addExt', () => {
  it('pass', () => {
    const r01 = addExt('a', 'b');
    const r02 = addExt('a.', 'b');

    expect(r01).toEqual('a.b');
    expect(r02).toEqual('a.b');
  });
});
