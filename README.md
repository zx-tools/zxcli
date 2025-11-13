# zxcli

[![NPM Version](https://img.shields.io/npm/v/zxcli.svg)](https://www.npmjs.com/package/zxcli)
[![NPM Downloads](https://img.shields.io/npm/dm/zxcli.svg)](https://www.npmjs.com/package/zxcli)
[![NPM Bundle Size](https://img.shields.io/bundlephobia/min/zxcli)](https://bundlephobia.com/package/zxcli)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/zx-tools/zxcli/publish.yml?branch=main)](https://github.com/zx-tools/zxcli/actions)
[![Node.js Version](https://img.shields.io/node/v/zxcli.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ZX Command Line Interface

## Quick Install

### Windows (PowerShell/Command Prompt)
```powershell
# Using PowerShell (recommended)
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/zx-tools/zxcli/main/install.bat" -OutFile "install.bat"; .\install.bat

# Or using curl if available
curl -o install.bat https://raw.githubusercontent.com/zx-tools/zxcli/main/install.bat && install.bat
```

### macOS/Linux (Terminal)
```bash
# Using curl
curl -o install.sh https://raw.githubusercontent.com/zx-tools/zxcli/main/install.sh && chmod +x install.sh && ./install.sh

# Or using wget
wget -O install.sh https://raw.githubusercontent.com/zx-tools/zxcli/main/install.sh && chmod +x install.sh && ./install.sh
```

The installer will:
- ✅ Check if Node.js is installed and meets requirements
- ✅ Install or update ZX CLI automatically
- ✅ Provide usage instructions

## Manual Installation

```bash
npm install -g zxcli
```

## Usage

```bash
zx hello
zx --version  # or zx -v
```

### Git Commands

ZX CLI includes built-in Git commands for convenience. Git installation is automatically checked and configured.

```bash
# Direct git commands
zx checkout main          # git checkout main
zx status                 # git status
zx add .                  # git add .
zx commit -m "message"    # git commit -m "message"
zx push                   # git push
zx pull                   # git pull

# Git subcommand group
zx git status             # Same as zx status
zx git log --oneline      # git log --oneline
```

**Git Installation Check**: On first use, ZX CLI checks if Git is installed and provides installation instructions if needed.

**Configuration**: Git availability is cached in `~/.zx-tools/zxconfig.json` for performance.

Available Git commands:
- `checkout` - Switch branches or restore files
- `branch` - List, create, or delete branches
- `status` - Show working tree status
- `add` - Add files to staging
- `commit` - Record changes
- `push` - Update remote refs
- `pull` - Fetch and integrate
- `log` - Show commit logs
- `diff` - Show changes
- `reset` - Reset HEAD
- `merge` - Join development histories
- `rebase` - Reapply commits
- `clone` - Clone repository
- `fetch` - Download objects
- `stash` - Stash changes

### NPM Script Delegation

When running `zx COMMAND` in a directory containing a `package.json` file, ZX will automatically delegate the command to `npm run COMMAND`:

```bash
# In a directory with package.json containing "build" script
zx build    # Runs: npm run build

# In a directory with package.json containing "test" script
zx test     # Runs: npm run test
```

If no matching npm script exists, ZX will show an error message.

Built-in commands like `hello` take precedence over npm script delegation.

## Development

### Building

```bash
npm run build
```

### Debug Build

For development and debugging, build with source maps and declarations:

```bash
npm run debug
```

This creates readable, non-minified files in the `debug/` folder with:
- Source maps for debugging
- Declaration files for TypeScript support
- Expanded code for easier debugging

### Linting

Run the linter to check code quality:

```bash
npm run lint
```

Automatically fix linting issues:

```bash
npm run lint:fix
```

Check linting with no warnings allowed (used in CI):

```bash
npm run lint:check
```

### Version Management

Bump version numbers using semantic versioning:

```bash
npm run bump:fix    # Patch version (1.0.0 → 1.0.1)
npm run bump:min    # Minor version (1.0.0 → 1.1.0)
npm run bump:maj    # Major version (1.0.0 → 2.0.0)
```

These commands will:
- Update version in `package.json`
- Create a git commit
- Create a git tag (e.g., `v1.0.1`)

### Publishing

Publish the package to NPM:

```bash
npm run publish:npm
```

**Note**: Make sure you're logged in to NPM first:
```bash
npm login
```

Or for automated publishing, set up NPM authentication with a token:
```bash
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN
```

### Release

Run a complete release process (linting, testing, building, and publishing):

```bash
npm run release
```

This script performs all quality checks and publishes in one command.

**Recommended workflow:**
```bash
# Make your changes
npm run bump:min    # Bump minor version
npm run release     # Test, build, and publish
```

## Deployment

This project uses automated deployment pipelines to ensure reliable releases.

### Automated Publishing

GitHub Actions automatically publishes new versions to NPM when minor versions change:

#### Setup
1. **Create NPM Token**: Go to https://www.npmjs.com/settings/tokens and create an automation token
2. **Add to GitHub Secrets**: In your repository settings, add `NPM_TOKEN` secret with your NPM token

#### CI/CD Pipeline
The automated pipeline includes:
- ✅ **Version Detection**: Monitors for minor version bumps (e.g., 1.0.0 → 1.1.0)
- ✅ **Quality Gates**: Linting, testing, and building before publish
- ✅ **Automated Release**: Publishes to NPM with public access
- ✅ **Git Tagging**: Creates version tags automatically

#### Triggers
- **Branch**: `main` branch only
- **Condition**: Minor version changes detected
- **Workflow**: `.github/workflows/publish.yml`

### Manual Deployment

For manual control or different version bumps:

```bash
# Version bumping
npm run bump:fix    # Patch: 1.0.0 → 1.0.1
npm run bump:min    # Minor: 1.0.0 → 1.1.0
npm run bump:maj    # Major: 1.0.0 → 2.0.0

# Publishing
npm run publish:npm # Direct publish to NPM
npm run release     # Full release pipeline
```

### Platform Installers

Cross-platform installation scripts are available:

#### Windows
```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/zx-tools/zxcli/main/install.bat" -OutFile "install.bat"; .\install.bat
```

#### macOS/Linux
```bash
curl -o install.sh https://raw.githubusercontent.com/zx-tools/zxcli/main/install.sh && chmod +x install.sh && ./install.sh
```

**Installer Features:**
- ✅ Node.js version checking
- ✅ Git installation detection
- ✅ Automatic ZX CLI installation
- ✅ Platform-specific guidance

### Release Workflow

**Recommended automated workflow:**
```bash
# Development
git checkout -b feature/new-feature
# Make changes...

# Release preparation
git checkout main
git merge feature/new-feature
npm run bump:min
git push origin main

# GitHub Actions automatically:
# 1. Detects version change
# 2. Runs quality checks
# 3. Builds and publishes
```

**Manual workflow:**
```bash
npm run bump:min    # Version bump
npm run release     # Quality checks + publish
```

### Deployment Status

[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/zx-tools/zxcli/publish.yml?branch=main)](https://github.com/zx-tools/zxcli/actions)

**Current Status:**
- **NPM Package**: https://www.npmjs.com/package/zxcli
- **Latest Version**: See NPM badge above
- **CI/CD**: GitHub Actions with automated publishing

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Development mode

Run the CLI in development mode with live reloading:

```bash
npm run dev hello
```