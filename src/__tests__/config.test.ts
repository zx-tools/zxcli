/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { configManager } from '../config';

// Mock file system operations
jest.mock('fs');
jest.mock('os');
jest.mock('path');

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockMkdirSync = mkdirSync as jest.MockedFunction<typeof mkdirSync>;
const mockReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;
const mockWriteFileSync = writeFileSync as jest.MockedFunction<typeof writeFileSync>;
const mockHomedir = homedir as jest.MockedFunction<typeof homedir>;
const mockJoin = join as jest.MockedFunction<typeof join>;

describe('ConfigManager', () => {
  const mockHomeDir = '/mock/home';
  const mockConfigDir = '/mock/home/.zx-tools';
  const mockConfigPath = '/mock/home/.zx-tools/zxconfig.json';

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    mockHomedir.mockReturnValue(mockHomeDir);
    mockJoin.mockImplementation((...args) => args.join('/').replace('//', '/'));

    // Reset singleton instance
    (configManager as any).configDir = mockConfigDir;
    (configManager as any).configPath = mockConfigPath;
  });

  describe('ensureConfigDir', () => {
    it('should create config directory if it does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      // Access private method through type assertion
      (configManager as any).ensureConfigDir();

      expect(mockMkdirSync).toHaveBeenCalledWith(mockConfigDir, { recursive: true });
    });

    it('should not create config directory if it already exists', () => {
      mockExistsSync.mockReturnValue(true);

      (configManager as any).ensureConfigDir();

      expect(mockMkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('loadConfig', () => {
    it('should return parsed config when file exists', () => {
      const mockConfig = { git: { installed: true } };
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(mockConfig));

      const result = (configManager as any).loadConfig();

      expect(result).toEqual(mockConfig);
      expect(mockReadFileSync).toHaveBeenCalledWith(mockConfigPath, 'utf8');
    });

    it('should return empty object when file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const result = (configManager as any).loadConfig();

      expect(result).toEqual({});
    });

    it('should return empty object when JSON parsing fails', () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue('invalid json');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = (configManager as any).loadConfig();

      expect(result).toEqual({});
      expect(consoleWarnSpy).toHaveBeenCalledWith('Warning: Could not load config file, using defaults');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('saveConfig', () => {
    it('should create config directory and save config', () => {
      mockExistsSync.mockReturnValue(false);
      const mockConfig = { git: { installed: true } };

      (configManager as any).saveConfig(mockConfig);

      expect(mockMkdirSync).toHaveBeenCalledWith(mockConfigDir, { recursive: true });
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        mockConfigPath,
        JSON.stringify(mockConfig, null, 2)
      );
    });

    it('should handle save errors gracefully', () => {
      mockExistsSync.mockReturnValue(false);
      mockWriteFileSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (configManager as any).saveConfig({});

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Could not save config file');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('setGitInstalled', () => {
    it('should update git configuration with version', () => {
      const mockConfig = {};
      (configManager as any).loadConfig = jest.fn().mockReturnValue(mockConfig);
      (configManager as any).saveConfig = jest.fn();

      configManager.setGitInstalled(true, '2.34.1');

      expect((configManager as any).saveConfig).toHaveBeenCalledWith({
        git: {
          installed: true,
          lastChecked: expect.any(String),
          version: '2.34.1'
        }
      });
    });
  });

  describe('isGitInstalled', () => {
    it('should return true when git is installed in config', () => {
      (configManager as any).loadConfig = jest.fn().mockReturnValue({
        git: { installed: true }
      });

      expect(configManager.isGitInstalled()).toBe(true);
    });

    it('should return false when git is not installed in config', () => {
      (configManager as any).loadConfig = jest.fn().mockReturnValue({
        git: { installed: false }
      });

      expect(configManager.isGitInstalled()).toBe(false);
    });

    it('should return false when git config does not exist', () => {
      (configManager as any).loadConfig = jest.fn().mockReturnValue({});

      expect(configManager.isGitInstalled()).toBe(false);
    });
  });

  describe('removeGitConfig', () => {
    it('should remove git configuration', () => {
      const mockConfig = { git: { installed: true }, other: 'value' };
      (configManager as any).loadConfig = jest.fn().mockReturnValue(mockConfig);
      (configManager as any).saveConfig = jest.fn();

      configManager.removeGitConfig();

      expect((configManager as any).saveConfig).toHaveBeenCalledWith({
        other: 'value'
      });
    });
  });

  describe('getGitVersion', () => {
    it('should return git version from config', () => {
      (configManager as any).loadConfig = jest.fn().mockReturnValue({
        git: { version: '2.34.1' }
      });

      expect(configManager.getGitVersion()).toBe('2.34.1');
    });

    it('should return undefined when no version in config', () => {
      (configManager as any).loadConfig = jest.fn().mockReturnValue({
        git: {}
      });

      expect(configManager.getGitVersion()).toBeUndefined();
    });
  });
});
