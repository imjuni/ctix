# Applying a Vue.js components to your source code

Vue.js components are not recognized by the TypeScript Compiler API because they are written in a syntax to Vue.js. In this case, you can still load and use Vue.js files by setting them up as modules.

`vue.d.ts`

```ts
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
```

`Foo.vue`

```html
<template>
  <div>foobar</div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  export default defineComponent({});
</script>
```

`index.ts`

```ts
/// <reference path="../types/vue.d.ts" />
import Foo from './Foo.vue';

export { Foo };
```

ctix does not yet automatically generate `index.ts` files for Vue.js component files. However, it is possible to export a Vue.js component set to module and bundle it into an `index.ts` file, as shown in the example. In this case, an `index.ts` file is generated with the following contents

```ts
export * from './components/index';
```

You can see an example at [examples/type10](https://github.com/imjuni/ctix/tree/master/examples/type10)
