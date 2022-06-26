/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const path = require('path');
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const webpackNodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');
const { merge } = require('webpack-merge');

const distPath = path.resolve(path.join(__dirname, 'dist'));

const configLib = {
  devtool: 'inline-source-map',
  externals: [
    webpackNodeExternals({
      allowlist: ['tslib'],
    }),
  ],
  mode: 'development',
  target: 'node',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    fallback: {
      __dirname: false,
      __filename: false,
      console: false,
      global: false,
      process: false,
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      '@tools': path.resolve(__dirname, 'src/tools'),
      '@options': path.resolve(__dirname, 'src/options'),
    },
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.json',
      }),
    ],
  },

  plugins: [
    new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new WebpackBar({ name: '-create-ts-index-x' }),
  ],

  entry: {
    ctix: ['./src/ctix.ts'],
  },

  output: {
    filename: 'ctix.js',
    libraryTarget: 'commonjs',
    path: distPath,
  },

  optimization: {
    minimize: false, // <---- disables uglify.
    // minimizer: [new UglifyJsPlugin()] if you want to customize it.
  },

  module: {
    rules: [
      {
        loader: 'json-loader',
        test: /\.json$/,
      },
      {
        exclude: /node_modules/,
        loader: 'ts-loader',
        test: /\.tsx?$/,
        options: {
          compilerOptions: {
            declaration: true /* Generates corresponding '.d.ts' file. */,
            declarationMap: false /* Generates corresponding '.d.ts' file. */,
          },
        },
      },
    ],
  },
};

const configCli = merge(configLib, {
  entry: {
    ctix: ['./src/cli.ts'],
  },

  output: {
    filename: 'cli.js',
    libraryTarget: 'commonjs',
    path: distPath,
  },
});

module.exports = [configLib, configCli];
