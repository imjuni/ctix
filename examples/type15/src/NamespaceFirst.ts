namespace NamespaceFirst {
  export function create(): NamespaceFirst {
    return { name: 'namespace-first' };
  }
}

interface NamespaceFirst {
  name: string;
}

export default NamespaceFirst;
