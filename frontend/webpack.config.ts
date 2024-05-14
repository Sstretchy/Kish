import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

type EnvVars = {
  mode: 'production' | 'development';
};

export default (env: EnvVars) => {
  const config: webpack.Configuration = {
    mode: env.mode ?? 'development',
    entry: path.resolve(__dirname, 'src', 'main.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[contenthash].js',
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
          test: /\.css$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: '[name]'
                }
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.less?$/,
          use: ['style-loader', 'css-loader', 'less-loader']
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.less'],
      alias: {
        variables: path.resolve(__dirname, 'src/styles/variables'),
      },
    },
  };

  return config;
};
