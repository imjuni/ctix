import { getCommentNamespace } from '#/comments/getCommentNamespace';

export function getCommentNamespaces(namespace?: string): string[] {
  if (namespace == null || namespace === '') {
    return [];
  }

  return namespace
    .split(/\s/)
    .filter((name) => name != null && name !== '')
    .map((name) => getCommentNamespace(name));
}
