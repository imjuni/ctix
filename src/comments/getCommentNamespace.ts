export function getCommentNamespace(namespace: string): string {
  const trimed = namespace.trim();

  if (trimed.endsWith(',')) {
    return trimed.substring(0, trimed.length - 1);
  }

  return trimed;
}
