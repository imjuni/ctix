CTIX - Next generation Create TypeScript Index file
----
[![Download Status](https://img.shields.io/npm/dw/ctix.svg)](https://npmcharts.com/compare/ctix?minimal=true) [![Github Star](https://img.shields.io/github/stars/imjuni/ctix.svg?style=popout)](https://github.com/imjuni/ctix) [![Github Issues](https://img.shields.io/github/issues-raw/imjuni/ctix.svg)](https://github.com/imjuni/ctix/issues) [![NPM version](https://img.shields.io/npm/v/ctix.svg)](https://www.npmjs.com/package/ctix) [![License](https://img.shields.io/npm/l/ctix.svg)](https://github.com/imjuni/ctix/blob/master/LICENSE) [![cti](https://circleci.com/gh/imjuni/ctix.svg?style=shield)](https://app.circleci.com/pipelines/github/imjuni/ctix?branch=master)

# 설치
```
npm install ctix --save-dev
```

# 소개
TypeScript 개발을 할 때 다른 프로젝트에서 사용할 패키지를 개발하기도 합니다. 패키지는 TypeScript 컴파일러를 사용해서 빌드하고 배포하지만 좀 더 성능향상을 하기 위해 webpack과 babel을 사용해서 좀 더 최적화를 하기도 합니다. webpack을 통해서 빌드할 때나 패키지로 배포할 때 다른 프로젝트에서 사용할 수 있는 진입점이 필요합니다. 이러한 진입점은 일반적으로 index.ts 파일을 생성해서 제공하며 외부에 노출할 파일을 직접 작성합니다.

이런 절차는 번거롭습니다. 버전업을 통해서 파일이 늘거나 줄거나 또는 클래스, 함수 등이 추가 되고 변경될 때 다시 작성해야 합니다. ctix는 이 때 유용한 도구입니다. .npmignore, .ctiignore를 사용해서 원치 않는 파일을 제외하고 tsconfig.json 파일을 전달해주기만 하면 단일 파일 또는 디렉토리 별로 index.ts 파일을 생성해서 자동으로 노출 파일을 생성합니다. 아래 예를 보겠습니다.

예를들어, 아래와 같은 디렉터리가 있다고 가정합시다.

```
  src/
    app.ts
    component/
      Nav.ts
      Button.ts
```

ctix create 모드는 아래와 같이 export index.ts 파일을 생성합니다.

```
  src/
    app.ts
    > index.ts
      // created from 'create-ts-index'
      export * from './component';
      export * from './app';
    component/
      Nav.ts
      Button.ts
      > index.ts
        // created from 'create-ts-index'
        export * from './Nav';
        export * from './Button';
```

만약 ctix single 모드는 아래와 단일 파일 하나를 생성합니다. webpack 진입점으로 사용하기 좋습니다.

```
  src/
    app.ts
    component/
      Na
      v.ts
      Button.ts
  > entrypoint.ts
    // created from 'create-ts-index'
    export * from './src/app.ts'
    export * from './src/component/Nav.ts'
    export * from './src/component/Button.ts'
```

# Why ctix?
1. tsconfig.json 파일만 전달하면 나머지 모든 과정은 자동입니다.
    * tsconfig.json에 작성된 include, exclude 등을 읽어서 index.ts 파일 작성이 필요한 모든 파일을 탐색합니다.
1. default index를 지원합니다.
    * compiler API를 사용해서 구문분석을 하여 default index를 찾습니다. 
    * default index는 파일이름으로 alias 됩니다.
    * my_default_index.test.ts 파일은 `export { default as myDefaultIndexTest } from './my_default_index.test'` 으로 작성됩니다.
    * default export와 함께 export 구문도 적용됩니다.
1. create, single, clean, init를 지원해서 사용하기 편리합니다.

# Usage
1. craete 모드
    * `ctix create ./tsconfig.json`
1. single 모드
    * `ctix single ./tsconfig.json`
1. clean 모드 
    * `ctix clean ./tsconfig.json`
1. init 모드
    * `ctix init ./tsconfig.json`

# Option

# Language
* [English](https://github.com/imjuni/create-ts-index/blob/master/README.md)
* [Korean](https://github.com/imjuni/create-ts-index/blob/master/README.ko.md)
