/* eslint-disable import/no-extraneous-dependencies */

const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.config.dev.cjs');

const [configLib, configCli] = devConfig;

const configLibProd = merge(configLib, {
  resolve: {
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.prod.json',
      }),
    ],
  },
});

const configCliProd = merge(configCli, {
  resolve: {
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.prod.json',
      }),
    ],
  },
});

module.exports = [configLibProd, configCliProd];
