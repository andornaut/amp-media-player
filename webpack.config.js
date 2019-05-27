const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const distPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'src');

module.exports = (env, argv = {}) => {
  const mode = argv.mode || 'production';
  const config = {
    entry: {
      main: './src/index.js',
      worker: './node_modules/http-basic-auth-proxy-worker/worker.js',
    },
    mode,
    module: {
      rules: [
        {
          test: /\.css$/,
          include: [srcPath],
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    output: {
      // Fix HMR in worker.js https://github.com/webpack/webpack/issues/6525
      globalObject: 'typeof self !== "undefined" ? self : this',
    },
    plugins: [new CopyWebpackPlugin(['index.html', { from: 'static/**/*' }])],
  };

  if (mode === 'development') {
    config.devServer = {
      contentBase: distPath,
      historyApiFallback: {
        index: '/index.html',
      },
      host: '0.0.0.0',
    };
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (mode === 'production') {
    config.plugins.push(new CleanWebpackPlugin());
  }

  return config;
};
