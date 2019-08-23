#!/usr/bin/env node

try {
  require('yargs')
    .command(['start [port]'], 'Run a local development server on port (default 5000)', (yargs) => {
      yargs
        .positional('port', {
          describe: 'Port to bind on',
          default: 5000
        })
    }, require('./server'))
    .showHelpOnFail()
    .demandCommand(1)
    .recommendCommands()
    .exitProcess(false)
    .argv;
} catch(e) {
}
