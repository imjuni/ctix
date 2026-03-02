import { getSep } from '#/modules/path/getSep';
import { describe, expect, it } from 'vitest';

describe('getSep', () => {
  it('should return path separator', () => {
    const result = getSep();
    expect(result).toBe('/'); // On Unix-like systems
    expect(typeof result).toBe('string');
  });
});
