# Interface: ICreateIndexInfos

## Table of contents

### Properties

- [depth](ICreateIndexInfos.md#depth)
- [exportStatements](ICreateIndexInfos.md#exportstatements)
- [resolvedDirPath](ICreateIndexInfos.md#resolveddirpath)
- [resolvedFilePaths](ICreateIndexInfos.md#resolvedfilepaths)

## Properties

### depth

• **depth**: `number`

depth of the resolvedDirPath

#### Defined in

[src/tools/interface/ICreateIndexInfos.ts:5](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/interface/ICreateIndexInfos.ts#L5)

___

### exportStatements

• **exportStatements**: `string`[]

real export statement
ex> export * from './wellmade'

#### Defined in

[src/tools/interface/ICreateIndexInfos.ts:21](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/interface/ICreateIndexInfos.ts#L21)

___

### resolvedDirPath

• **resolvedDirPath**: `string`

resolved dir path

#### Defined in

[src/tools/interface/ICreateIndexInfos.ts:15](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/interface/ICreateIndexInfos.ts#L15)

___

### resolvedFilePaths

• `Optional` **resolvedFilePaths**: `string`[]

resolved file path, if case of 'index.ts' that is empty

#### Defined in

[src/tools/interface/ICreateIndexInfos.ts:10](https://github.com/imjuni/ctix/blob/9bd0760/src/tools/interface/ICreateIndexInfos.ts#L10)
