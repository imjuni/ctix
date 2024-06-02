# Applying a font file to your source code

When developing a front-end project, you might want to include fonts in your source code in order to include them in a bundler like `webpack`.

```ts
/// <reference path="./DeclareTtfModule.d.ts" />
// WildcardDeclaration.ts
import Friend from 'Friend.ttf';
import AlsoFriend from './fonts/AlsoFriend.ttf';

export { Friend, AlsoFriend };
```

```ts
// DeclareTtfModule.d.ts
declare module '*.ttf';
```

In this case, the TypeScript Compiler API reads the `DeclareTftModule.d.ts` file and treats font files like `Friend`, `AlsoFriend` as modules. If you add the export keyword to a module like this, the following export statement is generated.

```ts
export * from './WildcardDeclaration';
```

You can see an example at [examples/type09](https://github.com/imjuni/ctix/tree/master/examples/type09)
