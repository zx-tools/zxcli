import { existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

/**
 * Checks if the current working directory contains a package.json file
 */
export function hasPackageJson(cwd: string = process.cwd()): boolean {
  return existsSync(join(cwd, 'package.json'));
}

/**
 * Executes npm run command for the given script name
 */
export function runNpmScript(scriptName: string, cwd: string = process.cwd()): void {
  try {
    console.log(`🚀 Running npm script: ${scriptName}`);
    execSync(`npm run ${scriptName}`, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env }
    });
  } catch (error) {
    console.error(`❌ Failed to run npm script: ${scriptName}`);
    console.error('Error:', error);
    process.exit(1);
  }
}

/**
 * Handles command delegation to npm if package.json exists
 * Returns true if command was delegated to npm, false otherwise
 */
export function tryDelegateToNpm(command: string, cwd: string = process.cwd()): boolean {
  if (hasPackageJson(cwd)) {
    console.log(`📦 Found package.json, delegating "${command}" to npm...`);
    runNpmScript(command, cwd);
    return true;
  }
  return false;
}
