import { program } from 'commander';
import { tryDelegateToNpm } from './package-runner';

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

// Handle unknown commands by trying to delegate to npm
cli.on('command:*', (unknownCommand: string[]) => {
  const command = unknownCommand[0];
  if (!tryDelegateToNpm(command)) {
    console.log(`❌ Unknown command: ${command}`);
    console.log('Run "zx --help" to see available commands.');
    process.exit(1);
  }
});

// Parse command line arguments if this file is run directly
if (require.main === module) {
  cli.parse();
}
