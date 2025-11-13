# zxcli
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