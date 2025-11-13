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