import { getPathFromReaddir } from '#/modules/path/getPathFromReaddir';
import { describe, expect, it } from 'vitest';

describe('getPathFromReaddir', () => {
  it('should be return path field when path only path exists object', () => {
    const expectPath = '/a/b/c';
    const filePath = getPathFromReaddir({ path: expectPath });

    expect(filePath).toBe(expectPath);
  });

  it('should be return parentPath field when path only path exists object', () => {
    const expectPath = '/e/f/g';
    const filePath = getPathFromReaddir({ parentPath: expectPath, path: '/a/b/c' });

    expect(filePath).toBe(expectPath);
  });
});
