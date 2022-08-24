# Interface: ICommonCliOption

## Table of contents

### Properties

- [c](ICommonCliOption.md#c)
- [config](ICommonCliOption.md#config)
- [exportFilename](ICommonCliOption.md#exportfilename)
- [f](ICommonCliOption.md#f)
- [p](ICommonCliOption.md#p)
- [project](ICommonCliOption.md#project)

## Properties

### c

• **c**: `string`

configuration file(.ctirc) path

#### Defined in

[src/configs/interfaces/ICommonCliOption.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICommonCliOption.ts#L5)

___

### config

• **config**: `string`

configuration file(.ctirc) path

#### Defined in

[src/configs/interfaces/ICommonCliOption.ts:9](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICommonCliOption.ts#L9)

___

### exportFilename

• **exportFilename**: `string`

Export filename, if you not pass this field that use "index.ts" or "index.d.ts"

**`Mode`**

create, single, clean

**`Default`**

index.ts

#### Defined in

[src/configs/interfaces/ICommonCliOption.ts:35](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICommonCliOption.ts#L35)

___

### f

• **f**: `string`

Export filename, if you not pass this field that use "index.ts" or "index.d.ts"

**`Mode`**

create, single, clean

**`Default`**

index.ts

#### Defined in

[src/configs/interfaces/ICommonCliOption.ts:29](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICommonCliOption.ts#L29)

___

### p

• **p**: `string`

tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
* only work root directory or cli parameter

**`Mode`**

all

#### Defined in

[src/configs/interfaces/ICommonCliOption.ts:16](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICommonCliOption.ts#L16)

___

### project

• **project**: `string`

tsconfig.json path: you must pass path with filename, like this "./tsconfig.json"
* only work root directory or cli parameter

**`Mode`**

all

#### Defined in

[src/configs/interfaces/ICommonCliOption.ts:22](https://github.com/imjuni/ctix/blob/9bd0760/src/configs/interfaces/ICommonCliOption.ts#L22)
