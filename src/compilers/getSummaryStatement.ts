import { CE_INLINE_COMMENT_KEYWORD } from '#/comments/const-enum/CE_INLINE_COMMENT_KEYWORD';
import { getInlineCommented } from '#/comments/getInlineCommented';
import { getNodeComments } from '#/comments/getNodeComments';
import type { IInlineCommentInfo } from '#/comments/interfaces/IInlineCommentInfo';
import { getExportedKind } from '#/compilers/getExportedKind';
import { getStatementAlias } from '#/compilers/getStatementAlias';
import { hasPublicNamespaceMember } from '#/compilers/hasPublicNamespaceMember';
import type { IExportStatement } from '#/compilers/interfaces/IExportStatement';
import { filenamify } from '#/modules/path/filenamify';
import { getRelativeDepth } from '#/modules/path/getRelativeDepth';
import * as tsm from 'ts-morph';

export function getSummaryStatement(params: {
  node: tsm.ExportedDeclarations;
  declarations?: tsm.ExportedDeclarations[];
  project: string;
  identifier?: string;
  alias?: string;
  eol: string;
  path: IExportStatement['path'];
  isDefault?: boolean;
}): IExportStatement {
  const kind = getExportedKind(params.node);
  const filenamified = filenamify(params.path.filename);
  const identifier = params.identifier ?? kind.name ?? filenamified;
  const declarations = params.declarations ?? [params.node];
  const hasNamespace = declarations.some(
    (declaration) =>
      tsm.Node.isModuleDeclaration(declaration) && tsm.Node.isIdentifier(declaration.getNameNode()),
  );
  const symbol = params.node.getSymbol();
  const resolvedSymbol = symbol?.isAlias() ? symbol.getAliasedSymbol() : symbol;
  const exportDeclarations = params.node.getSourceFile().getExportDeclarations();
  const matchingExports = exportDeclarations.flatMap((declaration) =>
    declaration
      .getNamedExports()
      .filter(
        (specifier) =>
          (specifier.getAliasNode()?.getText() ?? specifier.getName()) === params.identifier,
      )
      .map((specifier) => ({ declaration, specifier })),
  );
  const isTypeOnly =
    matchingExports.length > 0 &&
    matchingExports.every(
      ({ declaration, specifier }) => declaration.isTypeOnly() || specifier.isTypeOnly(),
    );
  /* eslint-disable no-bitwise */
  const isPureType =
    isTypeOnly ||
    (hasNamespace && resolvedSymbol != null
      ? (resolvedSymbol.getFlags() & tsm.SymbolFlags.Value) === 0
      : kind.isPureType);
  /* eslint-enable no-bitwise */
  const nodeComments = hasNamespace
    ? declarations.flatMap((declaration) => getNodeComments(declaration))
    : [];
  const exportComments = hasNamespace
    ? matchingExports.flatMap(({ declaration }) => getNodeComments(declaration))
    : [];
  const comments = [
    ...nodeComments,
    ...exportComments,
    ...(hasNamespace ? getNodeComments(params.node, kind.name) : []),
    ...getNodeComments(params.node, params.identifier),
  ]
    .filter(
      (comment, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.filePath === comment.filePath &&
            candidate.pos.start === comment.pos.start &&
            candidate.range === comment.range,
        ) === index,
    )
    .map((comment) =>
      getInlineCommented({
        comment,
        options: {
          keyword: CE_INLINE_COMMENT_KEYWORD.NEXT_STATEMENT_EXCLUDE_KEYWORD,
        },
      }),
    )
    .filter((comment): comment is IInlineCommentInfo => comment != null);

  const pos = params.node.getSourceFile().getLineAndColumnAtPos(params.node.getStart(false));

  return {
    path: params.path,
    depth: getRelativeDepth(params.project, params.path.dirPath),
    pos,
    identifier: {
      name: identifier,
      alias: getStatementAlias({
        kind,
        filenamified,
        alias: params.alias,
        isDefault: params.isDefault,
      }),
    },
    isPureType,
    isAnonymous: kind.name == null,
    isDefault: params.isDefault ?? false,
    isExcluded: comments.length > 0 || (hasNamespace && !hasPublicNamespaceMember(declarations)),
    comments,
  } satisfies IExportStatement;
}
