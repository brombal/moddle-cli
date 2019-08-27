#!/usr/bin/env node

try {
  const yargs = require('yargs');
  const argv = yargs
    .command('start', 'Run a local development server', (yargs) => {
      yargs
        .option('port', {
          alias: 'p',
          describe: 'Port to bind on',
          type: 'number'
        })
        .option('template', {
          describe: 'Template .ejs file to render',
          type: 'string'
        })
        .option('tsconfig', {
          describe: 'Additional options for TypeScript compiler',
        })
        .option('webpack', {
          describe: 'Additional options for webpack',
        })
        .option('devServer', {
          describe: 'Additional options for webpack dev server',
        })
        .config('config', path => {
          let config = require(path);
          if (typeof config === 'function') config = config();
          return config;
        })
        .default('config', 'maketa.config.json')
    }, require('./server'))
    .recommendCommands()
    .exitProcess(false)
    .strict()
    .argv;

  if (!argv._[0] && !argv.help) {
    yargs.showHelp();
  }

} catch(e) {
  console.log(e);
}
