import { execSync } from 'child_process';
import { Command } from 'commander';
import { configManager } from '../config';

export interface GitCommand {
  name: string;
  description: string;
  action: (...args: unknown[]) => void;
}

const gitCommands: GitCommand[] = [
  {
    name: 'checkout',
    description: 'Switch branches or restore working tree files',
    action: (...args: unknown[]) => runGitCommand('checkout', args)
  },
  {
    name: 'branch',
    description: 'List, create, or delete branches',
    action: (...args: unknown[]) => runGitCommand('branch', args)
  },
  {
    name: 'status',
    description: 'Show the working tree status',
    action: (...args: unknown[]) => runGitCommand('status', args)
  },
  {
    name: 'add',
    description: 'Add file contents to the index',
    action: (...args: unknown[]) => runGitCommand('add', args)
  },
  {
    name: 'commit',
    description: 'Record changes to the repository',
    action: (...args: unknown[]) => runGitCommand('commit', args)
  },
  {
    name: 'push',
    description: 'Update remote refs along with associated objects',
    action: (...args: unknown[]) => runGitCommand('push', args)
  },
  {
    name: 'pull',
    description: 'Fetch from and integrate with another repository',
    action: (...args: unknown[]) => runGitCommand('pull', args)
  },
  {
    name: 'log',
    description: 'Show commit logs',
    action: (...args: unknown[]) => runGitCommand('log', args)
  },
  {
    name: 'diff',
    description: 'Show changes between commits, commit and working tree, etc',
    action: (...args: unknown[]) => runGitCommand('diff', args)
  },
  {
    name: 'reset',
    description: 'Reset current HEAD to the specified state',
    action: (...args: unknown[]) => runGitCommand('reset', args)
  },
  {
    name: 'merge',
    description: 'Join two or more development histories together',
    action: (...args: unknown[]) => runGitCommand('merge', args)
  },
  {
    name: 'rebase',
    description: 'Reapply commits on top of another base tip',
    action: (...args: unknown[]) => runGitCommand('rebase', args)
  },
  {
    name: 'clone',
    description: 'Clone a repository into a new directory',
    action: (...args: unknown[]) => runGitCommand('clone', args)
  },
  {
    name: 'fetch',
    description: 'Download objects and refs from another repository',
    action: (...args: unknown[]) => runGitCommand('fetch', args)
  },
  {
    name: 'stash',
    description: 'Stash the changes in a dirty working directory away',
    action: (...args: unknown[]) => runGitCommand('stash', args)
  }
];

function checkGitInstallation(): boolean {
  try {
    // Check if git is available
    execSync('git --version', { stdio: 'pipe' });

    // Get git version
    const versionOutput = execSync('git --version', { encoding: 'utf8' });
    const versionMatch = versionOutput.match(/git version (\d+\.\d+\.\d+)/);
    const version = versionMatch ? versionMatch[1] : undefined;

    // Record successful git installation
    configManager.setGitInstalled(true, version);
    return true;
  } catch {
    // Git is not installed
    console.error('❌ Git is not installed on this system.');
    console.log('');
    console.log('To install Git, please visit: https://git-scm.com/downloads');
    console.log('');
    console.log('Installation options:');
    console.log('');

    // Detect platform and provide specific instructions
    const platform = process.platform;

    if (platform === 'win32') {
      console.log('Windows:');
      console.log('  1. Download the installer from https://git-scm.com/download/win');
      console.log('  2. Run the installer and follow the setup wizard');
      console.log('  3. Restart your terminal/command prompt');
      console.log('  4. Verify with: git --version');
    } else if (platform === 'darwin') {
      console.log('macOS:');
      console.log('  Option 1 - Homebrew (recommended):');
      console.log('    brew install git');
      console.log('');
      console.log('  Option 2 - Xcode Command Line Tools:');
      console.log('    xcode-select --install');
      console.log('');
      console.log('  Option 3 - Download from: https://git-scm.com/download/mac');
    } else if (platform === 'linux') {
      console.log('Linux:');
      console.log('  Ubuntu/Debian: sudo apt-get install git');
      console.log('  CentOS/RHEL:   sudo yum install git');
      console.log('  Fedora:        sudo dnf install git');
      console.log('  Arch Linux:    sudo pacman -S git');
      console.log('');
      console.log('  Or download from: https://git-scm.com/download/linux');
    } else {
      console.log('Unknown platform. Please visit https://git-scm.com/downloads');
      console.log('and download the appropriate version for your operating system.');
    }

    console.log('');
    console.log('After installation, run your git command again.');

    // Remove git from config since it's not available
    configManager.removeGitConfig();
    return false;
  }
}

function runGitCommand(subcommand: string, args: unknown[]): void {
  // Check git installation first
  if (!checkGitInstallation()) {
    process.exit(1);
  }

  try {
    // Filter out any non-string arguments and join properly
    const stringArgs = args.filter(arg => typeof arg === 'string');
    const commandArgs = stringArgs.join(' ');
    const command = commandArgs ? `git ${subcommand} ${commandArgs}` : `git ${subcommand}`;
    console.log(`🔧 Executing: ${command}`);
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env }
    });

    // Ensure git is recorded as available in config
    if (!configManager.isGitInstalled()) {
      configManager.setGitInstalled(true);
    }
  } catch (error) {
    const stringArgs = args.filter(arg => typeof arg === 'string');
    const commandArgs = stringArgs.join(' ');
    const failedCommand = commandArgs ? `git ${subcommand} ${commandArgs}` : `git ${subcommand}`;
    console.error(`❌ Git command failed: ${failedCommand}`);
    console.error('Error:', error);

    // If git command fails, it might indicate git is not properly configured
    // Remove git from config to force re-checking next time
    configManager.removeGitConfig();

    process.exit(1);
  }
}

export function registerGitCommands(cli: Command): void {
  // Create a git subcommand group
  const gitCmd = cli.command('git')
    .description('Git version control commands')
    .helpOption('-h, --help', 'Display help for git commands');

  // Register individual git commands
  gitCommands.forEach(cmd => {
    gitCmd
      .command(cmd.name)
      .description(cmd.description)
      .allowUnknownOption()
      .action(cmd.action);
  });

  // Also register git commands directly on root CLI for convenience
  gitCommands.forEach(cmd => {
    cli
      .command(cmd.name)
      .description(`Git ${cmd.name}: ${cmd.description}`)
      .allowUnknownOption()
      .action(cmd.action);
  });
}

export { gitCommands };
