/* eslint-disable @typescript-eslint/no-explicit-any */
import { execSync } from 'child_process';
import { gitCommands, registerGitCommands } from '../cmds/git-cmds';
import { Command } from 'commander';

// Mock dependencies
jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

jest.mock('../config', () => ({
  configManager: {
    setGitInstalled: jest.fn(),
    isGitInstalled: jest.fn(),
    removeGitConfig: jest.fn(),
    getGitVersion: jest.fn()
  }
}));

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

import { configManager } from '../config';

describe('git-cmds', () => {
  let consoleSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation();
    mockExecSync.mockClear();
    jest.clearAllMocks();

    // Mock git as installed by default
    mockExecSync.mockImplementation((command: string) => {
      if (command.includes('git --version')) {
        return 'git version 2.34.1';
      }
      return '';
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  describe('gitCommands array', () => {
    it('should contain expected git commands', () => {
      const expectedCommands = [
        'checkout', 'branch', 'status', 'add', 'commit', 'push', 'pull',
        'log', 'diff', 'reset', 'merge', 'rebase', 'clone', 'fetch', 'stash'
      ];

      const commandNames = gitCommands.map(cmd => cmd.name);
      expect(commandNames).toEqual(expectedCommands);
    });

    it('should have descriptions for all commands', () => {
      gitCommands.forEach(cmd => {
        expect(cmd.description).toBeDefined();
        expect(typeof cmd.description).toBe('string');
        expect(cmd.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('registerGitCommands', () => {
    it('should register git commands on the CLI', () => {
      const cli = new Command();
      registerGitCommands(cli);

      // Check that individual git commands are registered
      expect(cli.commands.find(cmd => cmd.name() === 'checkout')).toBeDefined();
      expect(cli.commands.find(cmd => cmd.name() === 'status')).toBeDefined();

      // Check that git subcommand group is registered
      expect(cli.commands.find(cmd => cmd.name() === 'git')).toBeDefined();
    });
  });

  describe('git command execution', () => {
    it('should execute git status command when git is installed', () => {
      // Find the status command and execute it
      const statusCmd = gitCommands.find(cmd => cmd.name === 'status');
      expect(statusCmd).toBeDefined();

      statusCmd!.action();

      // Should check git version first
      expect(mockExecSync).toHaveBeenCalledWith('git --version', { stdio: 'pipe' });
      // Then execute the git status command
      expect(mockExecSync).toHaveBeenCalledWith('git status', {
        stdio: 'inherit',
        env: expect.any(Object)
      });
      expect(consoleSpy).toHaveBeenCalledWith('🔧 Executing: git status');
      expect(configManager.setGitInstalled).toHaveBeenCalledWith(true, '2.34.1');
    });

    it('should execute git checkout with arguments', () => {
      mockExecSync.mockImplementation();

      const checkoutCmd = gitCommands.find(cmd => cmd.name === 'checkout');
      expect(checkoutCmd).toBeDefined();

      checkoutCmd!.action('main', 'some-arg');

      expect(mockExecSync).toHaveBeenCalledWith('git checkout main some-arg', {
        stdio: 'inherit',
        env: expect.any(Object)
      });
      expect(consoleSpy).toHaveBeenCalledWith('🔧 Executing: git checkout main some-arg');
    });

    it('should handle git command errors and remove git from config', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation();

      // Mock git command to fail
      mockExecSync.mockImplementation((command: string) => {
        if (command.includes('git --version')) {
          return 'git version 2.34.1';
        }
        throw new Error('Git command failed');
      });

      const statusCmd = gitCommands.find(cmd => cmd.name === 'status');
      statusCmd!.action();

      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Git command failed: git status');
      expect(configManager.removeGitConfig).toHaveBeenCalled();
      expect(exitSpy).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should filter out non-string arguments', () => {
      mockExecSync.mockImplementation();

      const checkoutCmd = gitCommands.find(cmd => cmd.name === 'checkout');
      checkoutCmd!.action('main', {}, 'valid-arg');

      expect(mockExecSync).toHaveBeenCalledWith('git checkout main valid-arg', {
        stdio: 'inherit',
        env: expect.any(Object)
      });
    });
  });
});
