const webpack = require('webpack');
const config = require('./config');
const stripAnsi = require('strip-ansi');

/**
 * Publishes the code in the specified app directory (options.appDir) and outputs its to the specified output
 * directory (options.outDir).
 * The webpackConfig function accepts the configuration object and can modify it as necessary.
 *
 * This method will throw an Error if webpack fails. The error object will have a .webpackErrors property with an
 * array containing errors.
 *
 * @param options {{
 *   appDir: string (default: process.cwd())
 *   outDir: string (default: process.cwd())
 *   outFile: string (default: 'index.js')
 *   webpackConfig: function (default: identity)
 * }}
 * @returns {Promise<{ stats: object, fs: object }>}
 */
module.exports = function publish(options = {}) {
  options = {
    appDir: process.cwd(),
    outDir: process.cwd(),
    outFile: 'index.js',
    webpackConfig: config => config,
    ...options
  };

  const webpackConfig = config.webpack(options.appDir, options.outFile);
  webpackConfig.mode = 'production';
  if (options.outDir) {
    webpackConfig.output.path = options.outDir;
  } else {
    webpackConfig.output.path = '/';
  }
  options.webpackConfig(webpackConfig);

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (e, stats) => {
      if (e) {
        return reject(e);
      }
      if (stats.compilation.errors.length) {
        e = new Error('Errors occurred during webpack compilation:');
        e.webpackErrors = Object.values(
          stats.compilation.errors.reduce((memo, error) => {
            const message = cleanWebpackFilename(stripAnsi(error.message), options.appDir);
            memo[message] = {
              file: cleanWebpackFilename(error.file, options.appDir),
              line: error.location.line,
              character: error.location.character,
              message: cleanWebpackFilename(stripAnsi(error.message), options.appDir),
            };
            return memo;
          }, {})
        );
        e.webpackStats = stats;
        return reject(e);
      }
      resolve({ stats });
    });
  });
};

function cleanWebpackFilename(filename, packageDir) {
  filename = filename.replace('/private' + packageDir + '/', '/');
  filename = filename.replace('/private' + packageDir, '/');
  filename = filename.replace(packageDir + '/', '/');
  filename = filename.replace(packageDir, '/');
  return filename;
}
