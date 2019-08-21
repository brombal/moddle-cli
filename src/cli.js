#!/usr/bin/env node

try {
  require('yargs')
    .command(['start'], 'Run a local development server', {}, require('./server'))
    .command(['publish'], 'Publish your app to your Moddle instance', {}, async () => {
      try {
        process.stdout.write('💚 Publishing...');
        const publish = require('./publish');
        const { stats } = await publish();
        process.stdout.write(` Done in ${(stats.endTime - stats.startTime) / 1000} seconds!\n`);
      } catch(e) {
        process.stdout.write('\n');
        if (e.message) {
          console.error(e.message);
        }
        if (e.webpackErrors) {
          e.webpackErrors.forEach(err => console.error(err.message))
        }
      }
    })
    .help()
    .argv;
} catch(e) {
  console.error(e);
}
