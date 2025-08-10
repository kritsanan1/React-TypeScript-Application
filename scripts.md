# Scripts Documentation

## Available Scripts Reference

This document provides comprehensive information about all available npm scripts in the project, including their purpose, parameters, usage examples, and troubleshooting guidance.

## Script Overview Table

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Start development server with hot reload | `--port`, `--host`, `--open` | `npm run dev -- --port 3000` | [Dev Server Issues](#dev-server-issues) |
| `build` | Build production-ready application | `--outDir`, `--mode` | `npm run build` | [Build Issues](#build-issues) |
| `lint` | Run ESLint for code quality checks | `--fix`, `--ext`, `--quiet` | `npm run lint -- --fix` | [Linting Issues](#linting-issues) |
| `preview` | Preview production build locally | `--port`, `--host` | `npm run preview -- --port 4000` | [Preview Issues](#preview-issues) |

## Detailed Script Documentation

### Development Server (`npm run dev`)

**Purpose**: Starts the Vite development server with hot module replacement, providing a fast development experience with real-time updates.

**Base Command**: `vite`

**Available Parameters**:
- `--port <number>`: Specify custom port (default: 5173)
- `--host [host]`: Expose server to network (default: localhost)
- `--open [path]`: Open browser automatically on server start
- `--cors`: Enable CORS for cross-origin requests
- `--force`: Force dependency optimization

**Usage Examples**:
```bash
# Basic development server
npm run dev

# Custom port
npm run dev -- --port 3000

# Expose to network (accessible from other devices)
npm run dev -- --host

# Open browser automatically
npm run dev -- --open

# Custom host and port with browser opening
npm run dev -- --host 0.0.0.0 --port 8080 --open
```

**Expected Output**:
```
  VITE v5.4.2  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Production Build (`npm run build`)

**Purpose**: Creates an optimized production build with minified assets, tree-shaking, and code splitting for deployment.

**Base Command**: `vite build`

**Available Parameters**:
- `--outDir <dir>`: Specify output directory (default: dist)
- `--mode <mode>`: Set build mode (development, production)
- `--base <path>`: Set public base path
- `--sourcemap`: Generate source maps for debugging

**Usage Examples**:
```bash
# Standard production build
npm run build

# Build with source maps
npm run build -- --sourcemap

# Custom output directory
npm run build -- --outDir build

# Build for specific environment
npm run build -- --mode staging
```

**Expected Output**:
```
vite v5.4.2 building for production...
✓ 34 modules transformed.
dist/index.html                  0.46 kB │ gzip:  0.30 kB
dist/assets/index-DiwrgTda.css   1.39 kB │ gzip:  0.72 kB
dist/assets/index-C2PWqlFX.js   143.61 kB │ gzip: 46.11 kB
✓ built in 1.23s
```

### Code Linting (`npm run lint`)

**Purpose**: Runs ESLint to check code quality, enforce coding standards, and identify potential issues in TypeScript and React code.

**Base Command**: `eslint .`

**Available Parameters**:
- `--fix`: Automatically fix fixable issues
- `--ext <extensions>`: Specify file extensions to lint
- `--quiet`: Report only errors, not warnings
- `--max-warnings <number>`: Set maximum warning threshold

**Usage Examples**:
```bash
# Basic linting
npm run lint

# Auto-fix issues
npm run lint -- --fix

# Only show errors
npm run lint -- --quiet

# Lint specific file types
npm run lint -- --ext .ts,.tsx

# Set warning threshold
npm run lint -- --max-warnings 0
```

**Expected Output**:
```bash
# No issues found
✨ All files passed linting!

# Issues found
src/App.tsx
  12:5  warning  'console' is not defined  no-undef
  25:3  error    Missing semicolon         semi

✖ 2 problems (1 error, 1 warning)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

### Production Preview (`npm run preview`)

**Purpose**: Serves the production build locally for testing and validation before deployment.

**Base Command**: `vite preview`

**Available Parameters**:
- `--port <number>`: Specify custom port (default: 4173)
- `--host [host]`: Expose server to network
- `--open [path]`: Open browser automatically

**Usage Examples**:
```bash
# Basic preview server
npm run preview

# Custom port
npm run preview -- --port 4000

# Expose to network
npm run preview -- --host

# Open browser automatically
npm run preview -- --open
```

**Expected Output**:
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

## Troubleshooting Guide

### Dev Server Issues

**Port Already in Use**
```bash
# Error: Port 5173 is already in use
# Solution 1: Use different port
npm run dev -- --port 3000

# Solution 2: Kill process using port
npx kill-port 5173
# or
lsof -ti:5173 | xargs kill -9
```

**Module Resolution Errors**
```bash
# Error: Cannot resolve module
# Solution: Clear cache and reinstall
rm -rf node_modules/.vite
rm -rf node_modules
npm install
```

**Hot Reload Not Working**
```bash
# Solution 1: Check file watching limits (Linux/Mac)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Solution 2: Restart dev server
# Ctrl+C to stop, then npm run dev
```

### Build Issues

**Out of Memory Errors**
```bash
# Error: JavaScript heap out of memory
# Solution: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**TypeScript Compilation Errors**
```bash
# Error: TypeScript compilation failed
# Solution 1: Check TypeScript configuration
npx tsc --noEmit

# Solution 2: Clear TypeScript cache
rm -rf node_modules/.cache
npm run build
```

**Asset Optimization Failures**
```bash
# Error: Failed to optimize assets
# Solution: Check asset file sizes and formats
# Large images should be optimized before build
# Ensure all imported assets exist
```

### Linting Issues

**ESLint Configuration Errors**
```bash
# Error: ESLint configuration is invalid
# Solution: Validate ESLint config
npx eslint --print-config src/App.tsx

# Check for conflicting rules
npx eslint --debug src/App.tsx
```

**Parsing Errors**
```bash
# Error: Parsing error with TypeScript
# Solution: Update TypeScript ESLint parser
npm update @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Rule Conflicts**
```bash
# Error: Conflicting ESLint rules
# Solution: Check eslint.config.js for rule conflicts
# Disable conflicting rules or adjust configuration
```

### Preview Issues

**Build Not Found**
```bash
# Error: Could not resolve build directory
# Solution: Ensure build exists
npm run build
npm run preview
```

**Static Asset Loading Issues**
```bash
# Error: Assets not loading in preview
# Solution: Check base path configuration
# Ensure assets are correctly referenced in build
```

## Advanced Usage

### Custom Script Combinations
```bash
# Build and preview in sequence
npm run build && npm run preview

# Lint and build (fail on lint errors)
npm run lint && npm run build

# Development with custom configuration
npm run dev -- --port 3000 --open --host
```

### Environment-Specific Scripts
```bash
# Development with staging environment
npm run dev -- --mode staging

# Production build with development source maps
npm run build -- --mode production --sourcemap
```

### Debugging Scripts
```bash
# Verbose output for debugging
npm run build -- --debug
npm run dev -- --debug

# Profile build performance
npm run build -- --profile
```