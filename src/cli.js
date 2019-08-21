#!/usr/bin/env node

try {
  require('yargs')
    .command(['start'], 'Run a local development server', {}, require('./server'))
    .help()
    .argv;
} catch(e) {
  console.error(e);
}
