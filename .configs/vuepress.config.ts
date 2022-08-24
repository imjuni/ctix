import { defaultTheme, type NavbarConfig } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
// @ts-ignore
import { typedocPlugin } from 'vuepress-plugin-typedoc/next';
const { mermaidPlugin } = require('@renovamen/vuepress-plugin-mermaid');

const navs: NavbarConfig = [
  {
    text: 'Guide',
    link: '/',
  },
  {
    text: 'Usage',
    children: [
      {
        text: 'Single',
        link: '/usage/single-command.md',
      },
      {
        text: 'Create',
        link: '/usage/create-command.md',
      },
    ],
  },
  {
    text: 'Extra',
    children: [
      {
        text: 'Information',
        children: ['/extra/migration-guilde.md', '/extra/use-root-dir.md'],
      },
    ],
  },
  {
    text: 'API Reference',
    link: '/api/README.md',
  },
  {
    text: 'Github',
    link: 'https://github.com/imjuni/ctix',
  },
];

export default defineUserConfig({
  lang: 'en-US',
  title: 'ctix',
  description: 'Next generation Create TypeScript Index file',
  plugins: [
    mermaidPlugin({ theme: 'dark', token: 'mermaid' }),
    typedocPlugin({
      // plugin options
      entryPoints: ['index.ts'],
      tsconfig: 'tsconfig.json',
      readme: 'none',
    }),
  ],
  base: '/ctix/',
  theme: defaultTheme({
    locales: {
      '/': {
        navbar: navs,
      },
    },
  }),
});
