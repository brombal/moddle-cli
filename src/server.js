const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const appDir = require('app-root-path').toString();

const config = require('./config');
const webpackConfig = config.webpack(appDir, 'index.js');
const devServerConfig = config.devServer(appDir);

webpackConfig.mode = 'development';
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerConfig);

module.exports = ({ port }) => {
  const compiler = webpack(webpackConfig);
  compiler.hooks.watchRun.tap('AsyncSeriesHook', () => {
    process.stdout.write('\r                                             ');
    process.stdout.write('\r🔷  Building...');
  });
  compiler.hooks.done.tap('AsyncSeriesHook', (stats) => {
    if (!stats.compilation.errors.length) {
      // console.log(stats.compilation);
      process.stdout.write('\r💚  Successfully built at ' + new Date().toLocaleString());
    } else {
      process.stdout.write('\r                                         \r');
    }
  });
  const server = new WebpackDevServer(compiler, devServerConfig);

  server.listen(port, 'localhost');
};
