import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getJsDocComment } from '#/comments/getJsDocComment';
import { getJsDocTag } from '#/comments/getJsDocTag';
import * as tsm from 'ts-morph';
import { describe, expect, it } from 'vitest';

describe('getJsDocComment', () => {
  it('multi-line comment', () => {
    const r01 = getJsDocComment(tsm.SyntaxKind.MultiLineCommentTrivia, '/* asdf */');
    expect(r01).toEqual('/** asdf */');
  });

  it('jsdoc comment', () => {
    const r01 = getJsDocComment(tsm.SyntaxKind.MultiLineCommentTrivia, '/** asdf */');
    expect(r01).toEqual('/** asdf */');
  });

  it('single line comment', () => {
    const r01 = getJsDocComment(tsm.SyntaxKind.SingleLineCommentTrivia, '// asdf');
    expect(r01).toEqual('/** asdf */');
  });

  it('triple slash line comment', () => {
    const r01 = getJsDocComment(tsm.SyntaxKind.SingleLineCommentTrivia, '/// asdf');
    expect(r01).toEqual('/** asdf */');
  });
});

describe('getJsDocTag', () => {
  it('start @', () => {
    const r01 = getJsDocTag(CE_INLINE_COMMENT_KEYWORD.FILE_EXCLUDE_KEYWORD);
    const r02 = getJsDocTag(CE_INLINE_COMMENT_KEYWORD.NEXT_STATEMENT_EXCLUDE_KEYWORD);
    const r03 = getJsDocTag(CE_INLINE_COMMENT_KEYWORD.FILE_GENERATION_STYLE_KEYWORD);

    expect(r01).toEqual('ctix-exclude');
    expect(r02).toEqual('ctix-exclude-next');
    expect(r03).toEqual('ctix-generation-style');
  });

  it('start alphabet', () => {
    const r01 = getJsDocTag('ctix-exclude');
    const r02 = getJsDocTag('ctix-exclude-next');
    const r03 = getJsDocTag('ctix-generation-style');

    expect(r01).toEqual('ctix-exclude');
    expect(r02).toEqual('ctix-exclude-next');
    expect(r03).toEqual('ctix-generation-style');
  });
});
