const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const findup = require('findup-sync');
const configFile = findup('maketa.config.{js,json}');
const appDir = path.dirname(configFile);

const configBuilder = require('./config');

module.exports = (options) => {
  const {
    port,
    webpack: webpackModifier,
    tsconfig: tsconfigModifier,
    devServer: devServerModifier,
  } = options;

  const webpackConfig = configBuilder.webpack(appDir, 'index.js', webpackModifier, tsconfigModifier);
  const devServerConfig = configBuilder.devServer(appDir, devServerModifier);
  devServerConfig.port = port || devServerConfig.port;

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
  process.stdout.write(`Maketa listenening on http://${devServerConfig.host}:${devServerConfig.port}/\n\n`);
  const server = new WebpackDevServer(compiler, devServerConfig);
  server.listen(devServerConfig.port, devServerConfig.host);
};
