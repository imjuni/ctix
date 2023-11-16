import { getCommentWorkspace } from '#/comments/getCommentWorkspace';
import { getCommentWorkspaces } from '#/comments/getCommentWorkspaces';
import { describe, expect, it } from '@jest/globals';

describe('getCommentNamespace', () => {
  it('ends-with ,', () => {
    const r01 = getCommentWorkspace('i-am-ironman,');
    const r02 = getCommentWorkspace('i-am-ironman, ');

    expect(r01).toEqual('i-am-ironman');
    expect(r02).toEqual('i-am-ironman');
  });

  it('ends-with space', () => {
    const r01 = getCommentWorkspace('i-am-ironman ');
    const r02 = getCommentWorkspace('i-am-ironman');

    expect(r01).toEqual('i-am-ironman');
    expect(r02).toEqual('i-am-ironman');
  });
});

describe('getCommentNamespaces', () => {
  it('empty ,', () => {
    const r01 = getCommentWorkspaces(null as any);
    const r02 = getCommentWorkspaces('');

    expect(r01).toEqual([]);
    expect(r02).toEqual([]);
  });

  it('comma seperate', () => {
    const r01 = getCommentWorkspaces('i-am-ironman, i-am-ca, i-am-hulk');
    expect(r01).toEqual(['i-am-ironman', 'i-am-ca', 'i-am-hulk']);
  });

  it('space seperate', () => {
    const r01 = getCommentWorkspaces('i-am-ironman i-am-ca i-am-hulk');
    expect(r01).toEqual(['i-am-ironman', 'i-am-ca', 'i-am-hulk']);
  });

  it('mix seperate', () => {
    const r01 = getCommentWorkspaces('i-am-ironman, i-am-ca, i-am-hulk i-am-spidey');
    expect(r01).toEqual(['i-am-ironman', 'i-am-ca', 'i-am-hulk', 'i-am-spidey']);
  });
});
