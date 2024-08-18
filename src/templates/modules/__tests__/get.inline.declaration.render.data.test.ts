import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import type { getInlineCommentedFiles } from '#/comments/getInlineCommentedFiles';
import { getInlineDeclarationRenderData } from '#/templates/modules/getInlineDeclarationRenderData';
import pathe from 'pathe';
import { describe, expect, it } from 'vitest';

describe('getInlineDeclarationRenderData', () => {
  it('successfully generate render data, with output directory', () => {
    const declarations: ReturnType<typeof getInlineCommentedFiles> = [
      {
        filePath: pathe.join(process.cwd(), '/a/b/c/d/a.ts'),
        commentCode: `// ${CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD}`,
        tag: CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD,
        pos: {
          line: 0,
          column: 0,
          start: 0,
        },
        workspaces: undefined,
      },
      {
        filePath: pathe.join(process.cwd(), '/a/b/c/e/b.ts'),
        commentCode: `// ${CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD}`,
        tag: CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD,
        pos: {
          line: 0,
          column: 0,
          start: 0,
        },
        workspaces: undefined,
      },
    ];

    const data = getInlineDeclarationRenderData(declarations, {
      output: pathe.join(process.cwd(), '/a/b/e'),
      fileExt: 'to-js',
    });

    expect(data).toMatchObject([
      {
        filePath: pathe.join(process.cwd(), '/a/b/c/d/a.ts'),
        commentCode: '// @ctix-declaration',
        tag: '@ctix-declaration',
        pos: { line: 0, column: 0, start: 0 },
        workspaces: undefined,
        relativePath: '../c/d/a.ts',
        extname: { origin: '.ts', render: '.js' },
      },
      {
        filePath: pathe.join(process.cwd(), '/a/b/c/e/b.ts'),
        commentCode: '// @ctix-declaration',
        tag: '@ctix-declaration',
        pos: { line: 0, column: 0, start: 0 },
        workspaces: undefined,
        relativePath: '../c/e/b.ts',
        extname: { origin: '.ts', render: '.js' },
      },
    ]);
  });

  it('successfully generate render data, without output directory', () => {
    const declarations: ReturnType<typeof getInlineCommentedFiles> = [
      {
        filePath: pathe.join(process.cwd(), '/a/b/c/d/a.ts'),
        commentCode: `// ${CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD}`,
        tag: CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD,
        pos: {
          line: 0,
          column: 0,
          start: 0,
        },
        workspaces: undefined,
      },
      {
        filePath: pathe.join(process.cwd(), '/a/b/c/e/b.ts'),
        commentCode: `// ${CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD}`,
        tag: CE_INLINE_COMMENT_KEYWORD.FILE_DECLARATION_KEYWORD,
        pos: {
          line: 0,
          column: 0,
          start: 0,
        },
        workspaces: undefined,
      },
    ];

    const data = getInlineDeclarationRenderData(declarations, {
      fileExt: 'to-js',
    });

    expect(data).toMatchObject([
      {
        filePath: pathe.join(process.cwd(), '/a/b/c/d/a.ts'),
        commentCode: '// @ctix-declaration',
        tag: '@ctix-declaration',
        pos: { line: 0, column: 0, start: 0 },
        workspaces: undefined,
        relativePath: `./${pathe.join(process.cwd(), '/a/b/c/d/a.ts')}`,
        extname: { origin: '.ts', render: '.js' },
      },
      {
        filePath: pathe.join(process.cwd(), '/a/b/c/e/b.ts'),
        commentCode: '// @ctix-declaration',
        tag: '@ctix-declaration',
        pos: { line: 0, column: 0, start: 0 },
        workspaces: undefined,
        relativePath: `./${pathe.join(process.cwd(), '/a/b/c/e/b.ts')}`,
        extname: { origin: '.ts', render: '.js' },
      },
    ]);
  });
});
