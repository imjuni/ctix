export function getIgnoreNamespace(raw?: string) {
  if (raw == null) {
    return undefined;
  }

  const namespaces = raw
    .trim()
    .split(/[, ]/)
    .map((namespace) => namespace.trim())
    .filter((namespace): namespace is string => namespace != null)
    .filter((namespace) => namespace !== '' && namespace !== ',')
    .filter((namespace) => !namespace.startsWith('*'));

  if (namespaces.length <= 0) {
    return undefined;
  }

  return namespaces;
}
