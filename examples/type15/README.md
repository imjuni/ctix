# Namespace export example

Run from the repository root:

```sh
USE_INIT_CWD=true pnpm run dev build -p examples/type15/tsconfig.json -o examples/type15/src --generation-style default-alias-named-destructive
pnpm exec tsc -p examples/type15/tsconfig.json --noEmit
pnpm exec vitest run src/compilers/__tests__/example.type15.test.ts
```

`InterfaceFirst` and `NamespaceFirst` reproduce declaration merging in both orders. Their default exports must remain value exports.

`Namespaces.ts` covers the following cases:

- `Empty` and `EmptyNested`: omitted because they have no public members.
- `PublicNested`: included, including `Inner.value`; the inner exclusion comment is ignored.
- `TypesOnly`: exported as a type.
- `Excluded`: omitted as a whole because one merged declaration has an exclusion comment.
- `Repeated`: included because a later merged declaration has a public member.

The integration test generates barrels in memory and checks consumer code without writing generated files into this example.
