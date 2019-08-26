const path = require('path');
const webpack = require('webpack');
const deepmerge = require('deepmerge');

const buildTemplateDir = path.resolve(__dirname, '..', 'build-template');

function loadConfig(appDir) {
  let maketaConfig;
  try {
    maketaConfig = require(path.resolve(appDir, 'maketa.config'));
  } catch(e) {
  }
  maketaConfig = Object.assign({}, {
    entry: 'main'
  }, maketaConfig);
  return maketaConfig;
}

module.exports.webpack = function getWebpackConfig(appDir, outFile, webpackModifier, tsconfigModifier) {
  const maketaConfig = loadConfig(appDir);
  let config = {
    mode: 'development',
    entry: path.resolve(buildTemplateDir, 'index.tsx'),
    output: {
      filename: outFile,
    },
    devtool: 'source-map',
    resolve: {
      alias: {
        '@app': appDir,
        'react-dom': '@hot-loader/react-dom'
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(appDir, 'tsconfig.json'),
              compilerOptions: {
                module: "es6",
                target: "es5",
                moduleResolution: "node",
                sourceMap: true,
                jsx: "react",
              }
            }
          },
        }, {
          test: /\.glb$/,
          use: 'file-loader'
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'maketaConfig.entry': JSON.stringify(path.resolve(appDir, maketaConfig.entry)),
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            filename: 'vendor.js',
            enforce: true
          },
        }
      }
    }
  };

  if (typeof tsconfigModifier === 'function')
    config.module.rules[0].use.options = tsconfigModifier(config.module.rules[0].use.options) || config.module.rules[0].use.options;
  else if (tsconfigModifier)
    config.module.rules[0].use.options = deepmerge(config.module.rules[0].use.options, tsconfigModifier);

  if (typeof webpackModifier === 'function')
    config = webpackModifier(config) || config;
  else if (webpackModifier)
    config = deepmerge(config, webpackModifier);

  return config;
};

module.exports.devServer = function getDevServer(appDir, modifier) {
  const maketaConfig = loadConfig(appDir);
  let config = {
    contentBase: buildTemplateDir,
    hot: true,
    host: 'localhost',
    noInfo: true,
    stats: {
      assets: false,
      builtAt: false,
      cached: false,
      cachedAssets: false,
      children: false,
      chunks: false,
      chunkGroups: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      depth: false,
      entrypoints: false,
      env: false,
      errors: true,
      errorDetails: true,
      hash: false,
      modules: false,
      moduleTrace: false,
      performance: false,
      providedExports: false,
      publicPath: false,
      reasons: false,
      source: false,
      timings: false,
      usedExports: false,
      version: false,
      warnings: true,
    },
    before: function (m, server) {
      server.app.set('view engine', 'ejs');
      server.use('/', function(req, res, next) {
        if (req.url === '/') {
          res.render(
            maketaConfig.template ? path.resolve(appDir, maketaConfig.template) : path.resolve(buildTemplateDir + '/index.ejs'),
            {
              maketa: {
                scripts: `
                  <script type="text/javascript" src="vendor.js"></script>
                  <script type="text/javascript" src="index.js"></script>
                `
              }
            }
          );
        } else {
          next();
        }
      });
    }
  };

  if (typeof modifier === 'function')
    config = modifier(config) || config;
  else if (modifier)
    config = deepmerge(config, modifier);

  return config;
};
