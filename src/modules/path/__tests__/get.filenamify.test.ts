import { filenamify } from '#/modules/path/filenamify';
import { describe, expect, it } from 'vitest';

describe('getFilenamify', () => {
  it('upper first case', () => {
    const r01 = filenamify('HelloWorld.ts');
    expect(r01).toEqual('HelloWorld');
  });

  it('camelCase to camelCase', () => {
    const r01 = filenamify('getExportStatement.ts');
    expect(r01).toEqual('getExportStatement');
  });

  it('camelCase to camelCase', () => {
    const r01 = filenamify('getExportStatement.ts');
    expect(r01).toEqual('getExportStatement');
  });

  it('invalid character remove with first', () => {
    const r01 = filenamify('get/ExportStatement.ts');
    expect(r01).toEqual('ExportStatement');
  });
});
