# zxcli
ZX Command Line Interface

## Installation

```bash
npm install -g zxcli
```

## Usage

```bash
zx hello
```

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