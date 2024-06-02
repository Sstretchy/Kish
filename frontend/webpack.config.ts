// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

type EnvVars = {
  mode: 'production' | 'development';
};

module.exports = (env: EnvVars) => {
  const config: webpack.Configuration = {
    mode: env.mode ?? 'development',
    entry: path.resolve(__dirname, 'src', 'main.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash].js',
      assetModuleFilename: 'assets/[hash][ext][query]',
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.less?$/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: '[local]--[hash:base64:5]',
                },
              },
            },
            { loader: 'less-loader' },
          ],
        },
        {
          test: /\.png/,
          type: 'asset/resource'
        }
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.less'],
      alias: {
        variables: path.resolve(__dirname, 'src/styles/variables'),
        assets: path.resolve(__dirname, 'src/assets'),
        styles: path.resolve(__dirname, 'src/styles'),
        components: path.resolve(__dirname, 'src/components'),
      },
    },
  };

  return config;
};
