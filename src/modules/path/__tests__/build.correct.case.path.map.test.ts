import { buildCorrectCasePathMap } from '#/modules/path/buildCorrectCasePathMap';
import fs from 'node:fs';
import os from 'node:os';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs', () => ({
  default: {
    promises: {
      readdir: vi.fn(),
    },
  },
}));

describe('buildCorrectCasePathMap', () => {
  const mockReaddir = vi.mocked(fs.promises.readdir);

  beforeEach(() => {
    mockReaddir.mockReset();
  });

  it('should return a map with posix paths for files in a single directory', async () => {
    mockReaddir.mockResolvedValueOnce(['MyFile.ts', 'OtherFile.ts'] as any);

    const inputs = ['/project/src/myfile.ts', '/project/src/otherfile.ts'];
    const result = await buildCorrectCasePathMap(inputs);

    expect(result.get('/project/src/myfile.ts')).toBe('/project/src/MyFile.ts');
    expect(result.get('/project/src/otherfile.ts')).toBe('/project/src/OtherFile.ts');
  });

  it('should read each unique directory only once', async () => {
    mockReaddir
      .mockResolvedValueOnce(['Alpha.ts', 'Beta.ts'] as any)
      .mockResolvedValueOnce(['Gamma.ts'] as any);

    const inputs = ['/project/src/alpha.ts', '/project/src/beta.ts', '/project/lib/gamma.ts'];
    await buildCorrectCasePathMap(inputs);

    expect(mockReaddir).toHaveBeenCalledTimes(2);
  });

  it('should keep original path when basename is not found in directory', async () => {
    mockReaddir.mockResolvedValueOnce(['OtherFile.ts'] as any);

    const inputs = ['/project/src/missing.ts'];
    const result = await buildCorrectCasePathMap(inputs);

    expect(result.get('/project/src/missing.ts')).toBe('/project/src/missing.ts');
  });

  it('should keep original path when directory is not readable', async () => {
    mockReaddir.mockRejectedValueOnce(new Error('ENOENT: no such file or directory'));

    const inputs = ['/nonexistent/src/file.ts'];
    const result = await buildCorrectCasePathMap(inputs);

    expect(result.get('/nonexistent/src/file.ts')).toBe('/nonexistent/src/file.ts');
  });

  it('should return posix-style paths (forward slashes only)', async () => {
    mockReaddir.mockResolvedValueOnce(['MyComponent.ts'] as any);

    const inputs = ['/project/src/mycomponent.ts'];
    const result = await buildCorrectCasePathMap(inputs);

    const value = result.get('/project/src/mycomponent.ts');
    expect(value).toBeDefined();
    expect(value).not.toContain('\\');
    expect(value).toBe('/project/src/MyComponent.ts');
  });

  it('should handle empty input array', async () => {
    const result = await buildCorrectCasePathMap([]);

    expect(result.size).toBe(0);
    expect(mockReaddir).not.toHaveBeenCalled();
  });

  it('should detect case-conflicting TypeScript files on case-insensitive platforms and exit', async () => {
    const platformSpy = vi.spyOn(os, 'platform').mockReturnValue('darwin');
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    // Two files that differ only in case → conflict
    mockReaddir.mockResolvedValueOnce(['Aa.ts', 'aA.ts'] as any);

    const inputs = ['/project/src/Aa.ts', '/project/src/aA.ts'];
    await buildCorrectCasePathMap(inputs);

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalled();

    platformSpy.mockRestore();
    exitSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should not report conflict for non-TypeScript files with same lower-case name', async () => {
    const platformSpy = vi.spyOn(os, 'platform').mockReturnValue('darwin');
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    // image.PNG and image.png are not TypeScript files → no conflict
    mockReaddir.mockResolvedValueOnce(['MyFile.ts', 'image.PNG', 'image.png'] as any);

    const inputs = ['/project/src/myfile.ts'];
    await buildCorrectCasePathMap(inputs);

    expect(exitSpy).not.toHaveBeenCalled();

    platformSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('should use "Windows" label when platform is win32 and case conflicts exist', async () => {
    const platformSpy = vi.spyOn(os, 'platform').mockReturnValue('win32');
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    mockReaddir.mockResolvedValueOnce(['Aa.ts', 'aA.ts'] as any);

    const inputs = ['/project/src/Aa.ts', '/project/src/aA.ts'];
    await buildCorrectCasePathMap(inputs);

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Windows'));

    platformSpy.mockRestore();
    exitSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should not exit on case-sensitive platforms even with same-lower-case filenames', async () => {
    const platformSpy = vi.spyOn(os, 'platform').mockReturnValue('linux');
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    mockReaddir.mockResolvedValueOnce(['Aa.ts', 'aA.ts'] as any);

    const inputs = ['/project/src/Aa.ts'];
    await buildCorrectCasePathMap(inputs);

    expect(exitSpy).not.toHaveBeenCalled();

    platformSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
