// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import Dotenv from 'dotenv-webpack';
import 'webpack-dev-server';

type EnvVars = {
  mode: 'production' | 'development';
};

module.exports = (env: EnvVars) => {
  const isProduction = env.mode === 'production';

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
      new Dotenv({
        path: isProduction ? './.env.production' : './.env',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.mode),
        'process.env.REACT_APP_API_URL': JSON.stringify(
          isProduction ? 'https://your-production-api-url.com' : 'http://localhost:3001'
        ),
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 8080,
    },
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
        utils: path.resolve(__dirname, 'src/utils'),
        api: path.resolve(__dirname, 'src/api'),
        const: path.resolve(__dirname, 'src/const'),
      },
    },
  };

  return config;
};
