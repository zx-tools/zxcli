import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface ZXConfig {
  git?: {
    installed: boolean;
    lastChecked: string;
    version?: string;
  };
  [key: string]: unknown;
}

export class ConfigManager {
  private configDir: string;
  private configPath: string;

  constructor() {
    // Cross-platform home directory
    this.configDir = join(homedir(), '.zx-tools');
    this.configPath = join(this.configDir, 'zxconfig.json');
  }

  private ensureConfigDir(): void {
    if (!existsSync(this.configDir)) {
      mkdirSync(this.configDir, { recursive: true });
    }
  }

  private loadConfig(): ZXConfig {
    try {
      if (existsSync(this.configPath)) {
        const data = readFileSync(this.configPath, 'utf8');
        return JSON.parse(data);
      }
    } catch {
      console.warn('Warning: Could not load config file, using defaults');
    }
    return {};
  }

  private saveConfig(config: ZXConfig): void {
    this.ensureConfigDir();
    try {
      writeFileSync(this.configPath, JSON.stringify(config, null, 2));
    } catch {
      console.error('Error: Could not save config file');
    }
  }

  public getConfig(): ZXConfig {
    return this.loadConfig();
  }

  public setGitInstalled(installed: boolean, version?: string): void {
    const config = this.loadConfig();
    config.git = {
      installed,
      lastChecked: new Date().toISOString(),
      version
    };
    this.saveConfig(config);
  }

  public isGitInstalled(): boolean {
    const config = this.loadConfig();
    return config.git?.installed === true;
  }

  public removeGitConfig(): void {
    const config = this.loadConfig();
    delete config.git;
    this.saveConfig(config);
  }

  public getGitVersion(): string | undefined {
    const config = this.loadConfig();
    return config.git?.version;
  }
}

export const configManager = new ConfigManager();
