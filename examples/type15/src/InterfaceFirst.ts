interface InterfaceFirst {
  name: string;
}

namespace InterfaceFirst {
  export function create(): InterfaceFirst {
    return { name: 'interface-first' };
  }
}

export default InterfaceFirst;
