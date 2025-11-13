import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { hasPackageJson, tryDelegateToNpm } from '../package-runner';

// Mock dependencies
jest.mock('fs');
jest.mock('child_process');
jest.mock('path', () => ({
  join: (...args: string[]) => args.join('/')
}));

const mockExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('package-runner', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('hasPackageJson', () => {
    it('should return true when package.json exists', () => {
      mockExistsSync.mockReturnValue(true);
      expect(hasPackageJson('/test/dir')).toBe(true);
      expect(mockExistsSync).toHaveBeenCalledWith('/test/dir/package.json');
    });

    it('should return false when package.json does not exist', () => {
      mockExistsSync.mockReturnValue(false);
      expect(hasPackageJson('/test/dir')).toBe(false);
      expect(mockExistsSync).toHaveBeenCalledWith('/test/dir/package.json');
    });

    it('should default to process.cwd() when no path provided', () => {
      const originalCwd = process.cwd;
      process.cwd = jest.fn().mockReturnValue('/current/dir');

      mockExistsSync.mockReturnValue(true);
      expect(hasPackageJson()).toBe(true);
      expect(mockExistsSync).toHaveBeenCalledWith('/current/dir/package.json');

      process.cwd = originalCwd;
    });
  });

  describe('tryDelegateToNpm', () => {
    it('should delegate to npm when package.json exists', () => {
      mockExistsSync.mockReturnValue(true);
      mockExecSync.mockImplementation();

      const result = tryDelegateToNpm('test');

      expect(result).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('📦 Found package.json, delegating "test" to npm...');
      expect(mockExecSync).toHaveBeenCalledWith('npm run test', {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: process.env
      });
    });

    it('should not delegate when package.json does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const result = tryDelegateToNpm('test');

      expect(result).toBe(false);
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(mockExecSync).not.toHaveBeenCalled();
    });

    it('should handle npm command errors', () => {
      mockExistsSync.mockReturnValue(true);
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation();

      mockExecSync.mockImplementation(() => {
        throw new Error('Command failed');
      });

      tryDelegateToNpm('failing-command');

      expect(consoleSpy).toHaveBeenCalledWith('📦 Found package.json, delegating "failing-command" to npm...');
      expect(errorSpy).toHaveBeenCalledWith('❌ Failed to run npm script: failing-command');
      expect(exitSpy).toHaveBeenCalledWith(1);

      errorSpy.mockRestore();
      exitSpy.mockRestore();
    });

    it('should use provided cwd', () => {
      mockExistsSync.mockReturnValue(true);
      mockExecSync.mockImplementation();

      tryDelegateToNpm('test', '/custom/dir');

      expect(mockExistsSync).toHaveBeenCalledWith('/custom/dir/package.json');
      expect(mockExecSync).toHaveBeenCalledWith('npm run test', {
        cwd: '/custom/dir',
        stdio: 'inherit',
        env: process.env
      });
    });
  });
});
