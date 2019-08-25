const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const appDir = require('app-root-path').toString();
const deepmerge = require('deepmerge');

const configBuilder = require('./config');

module.exports = (options) => {
  const { port } = options;

  let webpackConfig = configBuilder.webpack(appDir, 'index.js');

  if (typeof options.tsconfig === 'function')
    options.tsconfig(webpackConfig.module.rules[0].use.options);
  else if (options.tsconfig)
    webpackConfig.module.rules[0].use.options = deepmerge(webpackConfig.module.rules[0].use.options, options.tsconfig);

  if (typeof options.webpack === 'function')
    options.webpack(webpackConfig);
  else if (options.webpack)
    webpackConfig = deepmerge(webpackConfig, options.webpack);

  let devServerConfig = configBuilder.devServer(appDir);
  if (typeof options.devServer === 'function')
    options.devServer(devServerConfig);
  else if (options.devServer)
    devServerConfig = deepmerge(devServerConfig, options.devServer);

  webpackConfig.mode = 'development';
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerConfig);
  const compiler = webpack(webpackConfig);
  compiler.hooks.watchRun.tap('AsyncSeriesHook', () => {
    process.stdout.write('\r                                             ');
    process.stdout.write('\r🔷 Building...');
  });
  compiler.hooks.done.tap('AsyncSeriesHook', (stats) => {
    if (!stats.compilation.errors.length) {
      process.stdout.write('\r💚 Successfully built at ' + new Date().toLocaleString());
    } else {
      process.stdout.write('\r                                         \r');
    }
  });
  const server = new WebpackDevServer(compiler, devServerConfig);

  server.listen(port, 'localhost');
};
