const path = require('path');
const webpack = require('webpack');

const buildTemplateDir = path.resolve(__dirname, '..', 'build-template');

function loadConfig(appDir) {
  let maketaConfig;
  try {
    maketaConfig = require(path.resolve(appDir, 'maketa.config'));
  } catch(e) {
    maketaConfig = {
      entry: 'main.jsx'
    }
  }
  return maketaConfig;
}

module.exports.webpack = function getWebpackConfig(appDir, outFile) {
  const maketaConfig = loadConfig(appDir);
  return {
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
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [{
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
          }],
        }, {
          test: /\.glb$/,
          use: 'file-loader'
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'maketaConfig.entry': JSON.stringify(path.resolve(appDir, maketaConfig.entry)),
      })
    ],
  };
};

module.exports.devServer = function getDevServer(appDir) {
  const maketaConfig = loadConfig(appDir);
  return {
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
            path.resolve(appDir, maketaConfig.template) || path.resolve(buildTemplateDir + '/index.ejs'),
            {
              maketa: {
                scripts: `<script type="text/javascript" src="index.js"></script>`
              }
            }
          );
        } else {
          next();
        }
      });
    }
  };
};
