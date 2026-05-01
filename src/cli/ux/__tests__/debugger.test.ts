import { Debugger } from '#/cli/ux/Debugger';
import fs from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Debugger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('table - does nothing when disabled', () => {
    const debuggerInstance = new Debugger(false, undefined);
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    debuggerInstance.table('label', [['key', 'value']]);

    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('table - logs each entry when enabled', () => {
    const debuggerInstance = new Debugger(true, undefined);
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    debuggerInstance.table('label', [
      ['key1', 'value1'],
      ['key2', 42],
    ]);

    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('label'));
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('key1 => value1'));
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('key2 => 42'));
  });

  it('logList - does nothing when disabled', () => {
    const debuggerInstance = new Debugger(false, undefined);
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    debuggerInstance.logList('label', ['item1']);

    expect(writeSpy).not.toHaveBeenCalled();
  });

  it('logList - logs each item when enabled', () => {
    const debuggerInstance = new Debugger(true, undefined);
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    debuggerInstance.logList('label', ['item1', 'item2']);

    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('label (2)'));
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('- item1'));
    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('- item2'));
  });

  it('logList - logs (empty) when items array is empty', () => {
    const debuggerInstance = new Debugger(true, undefined);
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    debuggerInstance.logList('label', []);

    expect(writeSpy).toHaveBeenCalledWith(expect.stringContaining('(empty)'));
  });

  it('log - writes to stream when stream is open', () => {
    const mockStream = { end: vi.fn(), write: vi.fn() };
    vi.spyOn(fs, 'createWriteStream').mockReturnValue(mockStream as unknown as fs.WriteStream);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    const debuggerInstance = new Debugger(false, '/tmp/ctix-test.log');
    debuggerInstance.enable = true;
    debuggerInstance.log('hello');

    expect(mockStream.write).toHaveBeenCalledWith(expect.stringContaining('hello'));
  });

  it('openStream - creates log directory when it does not exist', () => {
    const mockStream = { end: vi.fn(), write: vi.fn() };
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    const mkdirSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined);
    vi.spyOn(fs, 'createWriteStream').mockReturnValue(mockStream as unknown as fs.WriteStream);

    const debuggerInstance = new Debugger(false, '/tmp/nonexistent/ctix-test.log');
    debuggerInstance.enable = true;

    expect(mkdirSpy).toHaveBeenCalledWith('/tmp/nonexistent', { recursive: true });
  });

  it('isBootstrap - returns true after module load auto-bootstrap', () => {
    expect(Debugger.isBootstrap).toBe(true);
  });

  it('bootstrap - is idempotent and does not reset the singleton', () => {
    const before = Debugger.it;
    Debugger.bootstrap();
    expect(Debugger.it).toBe(before);
  });

  it('enable getter - returns current enable state', () => {
    const debuggerInstance = new Debugger(false, undefined);
    expect(debuggerInstance.enable).toBe(false);

    debuggerInstance.enable = true;
    expect(debuggerInstance.enable).toBe(true);
  });

  it('logFile setter - opens stream when enable is true and logFile is set', () => {
    const mockStream = { end: vi.fn(), write: vi.fn() };
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    const createWriteStreamSpy = vi
      .spyOn(fs, 'createWriteStream')
      .mockReturnValue(mockStream as unknown as fs.WriteStream);

    const debuggerInstance = new Debugger(true, undefined);
    debuggerInstance.logFile = '/tmp/ctix-test.log';

    expect(createWriteStreamSpy).toHaveBeenCalled();
  });

  it('logFile setter - does not open stream when enable is false', () => {
    const createWriteStreamSpy = vi.spyOn(fs, 'createWriteStream');

    const debuggerInstance = new Debugger(false, undefined);
    debuggerInstance.logFile = '/tmp/ctix-test.log';

    expect(createWriteStreamSpy).not.toHaveBeenCalled();
  });

  it('close - does nothing when stream is not open', () => {
    const debuggerInstance = new Debugger(false, undefined);
    expect(() => debuggerInstance.close()).not.toThrow();
  });

  it('close - ends and clears the write stream', () => {
    const mockStream = { end: vi.fn(), write: vi.fn() };
    vi.spyOn(fs, 'createWriteStream').mockReturnValue(mockStream as unknown as fs.WriteStream);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const debuggerInstance = new Debugger(false, '/tmp/ctix-test.log');
    debuggerInstance.enable = true;
    debuggerInstance.close();

    expect(mockStream.end).toHaveBeenCalledOnce();
  });

  it('close - second call does nothing after stream is cleared', () => {
    const mockStream = { end: vi.fn(), write: vi.fn() };
    vi.spyOn(fs, 'createWriteStream').mockReturnValue(mockStream as unknown as fs.WriteStream);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const debuggerInstance = new Debugger(false, '/tmp/ctix-test.log');
    debuggerInstance.enable = true;
    debuggerInstance.close();
    debuggerInstance.close();

    expect(mockStream.end).toHaveBeenCalledOnce();
  });
});
