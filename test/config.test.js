const expect = require('chai').expect;
const config = require('../src/config');
const path = require('path');

describe('Config', function() {
  describe('.webpack()', function() {
    it('should return default value', function() {
      const webpackConfig = config.webpack('.', 'file.js');
      expect(webpackConfig).to.not.be.null;
      expect(webpackConfig.resolve.alias['@app']).to.equal('.');
      expect(webpackConfig.module.rules[0].use.options.configFile).to.be.null;
    });

    it('should modify webpack config with object', function() {
      const webpackConfig = config.webpack('.', 'file.js', { entry: 'modified' });
      expect(webpackConfig.entry).to.equal('modified');
    });

    it('should modify webpack config with function (no return value)', function() {
      const webpackConfig = config.webpack('.', 'file.js', (config) => { config.entry = 'modified' });
      expect(webpackConfig.entry).to.equal('modified');
    });

    it('should modify webpack config with function (return value)', function() {
      const webpackConfig = config.webpack('.', 'file.js', (config) => { config.entry = 'modified'; return config; });
      expect(webpackConfig.entry).to.equal('modified');
    });

    it('should modify tsc config with object', function() {
      const webpackConfig = config.webpack('.', 'file.js', null, { configFile: 'modified' });
      expect(webpackConfig.module.rules[0].use.options.configFile).to.equal('modified');
    });

    it('should modify tsc config with function (no return value)', function() {
      const webpackConfig = config.webpack('.', 'file.js', null, (config) => { config.configFile = 'modified' });
      expect(webpackConfig.module.rules[0].use.options.configFile).to.equal('modified');
    });

    it('should modify tsc config with function (return value)', function() {
      const webpackConfig = config.webpack('.', 'file.js', null, (config) => { config.configFile = 'modified'; return config; });
      expect(webpackConfig.module.rules[0].use.options.configFile).to.equal('modified');
    });

    it('should modify tsc config before webpack config', function() {
      const webpackConfig = config.webpack('.', 'file.js', { module: { rules: { 0: { use: { options: { configFile: 'modified2' }}}}}}, { configFile: 'modified1' });
      expect(webpackConfig.module.rules[0].use.options.configFile).to.equal('modified2');
    });
  });

  describe('.devServer()', function() {
    it('should return default value', function() {
      const serverConfig = config.devServer('.');
      expect(serverConfig).to.not.be.null;
      expect(serverConfig.host).to.equal('localhost');
    });

    it('should modify dev server config with object', function() {
      const serverConfig = config.devServer('.', { host: 'modified' });
      expect(serverConfig.host).to.equal('modified');
    });

    it('should modify dev server config with function (no return value)', function() {
      const serverConfig = config.devServer('.', (config) => { config.host = 'modified' });
      expect(serverConfig.host).to.equal('modified');
    });

    it('should modify dev server config with function (return value)', function() {
      const serverConfig = config.devServer('.', (config) => { config.host = 'modified'; return config; });
      expect(serverConfig.host).to.equal('modified');
    });
  });
});