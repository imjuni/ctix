import { atOrUndefined } from 'my-easy-fp';

export function getCommentNamespace(namespace: string): string | undefined {
  const firstChar = atOrUndefined(namespace, 0);
  const remain = namespace.substring(1);

  if (firstChar == null) {
    return undefined;
  }

  if (!/\s/g.test(firstChar)) {
    return undefined;
  }

  if (remain.length <= 0) {
    return undefined;
  }

  const refined = atOrUndefined(remain.split(/\s/), 0);
  return refined;
}
