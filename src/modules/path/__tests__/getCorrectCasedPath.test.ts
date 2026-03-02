import { getCorrectCasedPath } from '#/modules/path/getCorrectCasedPath';
import * as getSepModule from '#/modules/path/getSep';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('node:fs', () => ({
  default: {
    promises: {
      readdir: vi.fn(),
    },
  },
}));

describe('getCorrectCasedPath', () => {
  const mockReaddir = vi.mocked(fs.promises.readdir);

  describe('when given an absolute path with correct casing', () => {
    it('should return the same path when filesystem matches', async () => {
      mockReaddir
        .mockResolvedValueOnce(['Users'] as any)
        .mockResolvedValueOnce(['testuser'] as any)
        .mockResolvedValueOnce(['project'] as any);

      const result = await getCorrectCasedPath('/Users/testuser/project');
      expect(result).toBe('/Users/testuser/project');
    });
  });

  describe('when given an absolute path with incorrect casing', () => {
    it('should return corrected path when filesystem has different case', async () => {
      mockReaddir
        .mockResolvedValueOnce(['Users'] as any)
        .mockResolvedValueOnce(['TestUser'] as any);

      const result = await getCorrectCasedPath('/users/testuser');
      expect(result).toBe('/Users/TestUser');
    });
  });

  describe('when filesystem entry is not found', () => {
    it('should keep original casing', async () => {
      mockReaddir.mockResolvedValueOnce(['other'] as any);

      const result = await getCorrectCasedPath('/Users/NonExistentUser');
      expect(result).toBe('/Users/NonExistentUser');
    });
  });

  describe('when parent directory does not exist', () => {
    it('should handle readdir error and break early', async () => {
      mockReaddir.mockRejectedValueOnce(new Error('ENOENT'));

      const result = await getCorrectCasedPath('/NonExistent/path/file.ts');
      expect(result).toBe('/NonExistent');
    });
  });

  describe('when Windows drive letter exists', () => {
    it('should handle Windows drive letter correctly', async () => {
      const platformSpy = vi.spyOn(os, 'platform').mockReturnValue('win32');
      const getSepSpy = vi.spyOn(getSepModule, 'getSep').mockReturnValue('\\');

      const result = await getCorrectCasedPath('C:');
      expect(result).toBeDefined();

      platformSpy.mockRestore();
      getSepSpy.mockRestore();
    });
  });

  describe('when error occurs during processing', () => {
    it('should return original path on any unexpected error', async () => {
      const normalizeSpy = vi.spyOn(path, 'normalize').mockImplementation(() => {
        throw new Error('Test error');
      });

      const result = await getCorrectCasedPath('/test');
      expect(result).toBe('/test');

      normalizeSpy.mockRestore();
    });
  });
});
