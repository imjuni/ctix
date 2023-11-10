export function getJsDocTag(tag: string) {
  if (tag.trim().startsWith('@')) {
    return tag.trim().substring(1);
  }

  return tag.trim();
}
