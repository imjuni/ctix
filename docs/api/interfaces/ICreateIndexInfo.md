# Interface: ICreateIndexInfo

## Table of contents

### Properties

- [depth](ICreateIndexInfo.md#depth)
- [exportStatement](ICreateIndexInfo.md#exportstatement)
- [resolvedDirPath](ICreateIndexInfo.md#resolveddirpath)
- [resolvedFilePath](ICreateIndexInfo.md#resolvedfilepath)

## Properties

### depth

• **depth**: `number`

depth of the resolvedDirPath

#### Defined in

[src/tools/interface/ICreateIndexInfo.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/interface/ICreateIndexInfo.ts#L5)

___

### exportStatement

• **exportStatement**: `string`

real export statement
ex> export * from './wellmade'

#### Defined in

[src/tools/interface/ICreateIndexInfo.ts:21](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/interface/ICreateIndexInfo.ts#L21)

___

### resolvedDirPath

• **resolvedDirPath**: `string`

resolved dir path

#### Defined in

[src/tools/interface/ICreateIndexInfo.ts:15](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/interface/ICreateIndexInfo.ts#L15)

___

### resolvedFilePath

• `Optional` **resolvedFilePath**: `string`

resolved file path, if case of 'index.ts' that is empty

#### Defined in

[src/tools/interface/ICreateIndexInfo.ts:10](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/interface/ICreateIndexInfo.ts#L10)
