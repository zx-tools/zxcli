#!/usr/bin/env node

import { program } from 'commander';

// Configure the CLI program
export const cli = program
  .name('zx')
  .description('ZX Command Line Interface')
  .version('1.0.0');

cli
  .command('hello')
  .description('Say hello')
  .action(() => {
    console.log('Hello from ZX CLI!');
  });

// Parse command line arguments if this file is run directly
if (require.main === module) {
  cli.parse();
}
