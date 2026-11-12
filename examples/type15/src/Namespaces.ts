export namespace Empty {
  interface PrivateMember {
    name: string;
  }
}

export namespace EmptyNested {
  export namespace Inner {
    interface PrivateMember {
      name: string;
    }
  }
}

export namespace PublicNested {
  export namespace Inner {
    /** @ctix-exclude-next */
    export const value = 42;
  }
}

export namespace TypesOnly {
  export interface Item {
    name: string;
  }
}

export namespace Excluded {
  export interface Item {
    name: string;
  }
}

/** @ctix-exclude-next */
export namespace Excluded {
  export const value = 1;
}

export namespace Repeated {
  interface PrivateMember {
    name: string;
  }
}

export namespace Repeated {
  export const value = 7;
}
