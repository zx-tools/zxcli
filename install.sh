#!/bin/bash

# ZX CLI Installer for macOS and Linux
# This script checks for Node.js, installs/updates ZX CLI, and provides usage instructions

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo
    echo "========================================"
    echo "    ZX CLI Installer for Unix"
    echo "========================================"
    echo
}

print_step() {
    echo -e "${BLUE}[$1/$2]${NC} $3"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Get Node.js version
get_node_version() {
    node --version 2>/dev/null | sed 's/v//'
}

# Extract major version from version string
get_major_version() {
    echo "$1" | cut -d. -f1
}

# Main installation logic
main() {
    print_header

    # Step 1: Check Node.js installation
    print_step 1 2 "Checking Node.js installation..."

    if ! command_exists node; then
        print_error "Node.js is not installed."
        echo
        echo "Please install Node.js from: https://nodejs.org/"
        echo "Download the LTS version for your operating system."
        echo
        echo "After installation, run this script again."
        exit 1
    fi

    NODE_VERSION=$(get_node_version)
    NODE_MAJOR=$(get_major_version "$NODE_VERSION")

    print_success "Node.js is installed: v$NODE_VERSION"

    if [ "$NODE_MAJOR" -lt 14 ]; then
        print_error "Node.js version v$NODE_VERSION is too old. Please upgrade to Node.js 14 or higher."
        echo "Download from: https://nodejs.org/"
        exit 1
    fi

    print_success "Node.js version is compatible."
    echo

    # Step 2: Check ZX CLI installation
    print_step 2 2 "Checking ZX CLI installation..."

    if ! command_exists zx; then
        print_warning "ZX CLI is not installed."
        echo "Installing ZX CLI..."
        echo

        # Install ZX CLI globally
        if ! npm install -g zxcli; then
            print_error "Failed to install ZX CLI."
            echo
            echo "This might happen if:"
            echo "- The package is not yet published to NPM"
            echo "- You have network connectivity issues"
            echo "- You need to run this with sudo/admin privileges"
            echo "- npm is not properly configured"
            echo
            echo "You can try installing manually with:"
            echo "  npm install -g zxcli"
            echo
            echo "Or if you need admin privileges:"
            echo "  sudo npm install -g zxcli"
            exit 1
        fi

        echo
        print_success "ZX CLI installed successfully!"
    else
        print_success "ZX CLI is already installed."

        # Check for updates (only if npm view works)
        if npm view zxcli version >/dev/null 2>&1; then
            echo "Checking for updates..."
            LATEST_VERSION=$(npm view zxcli version)
            CURRENT_VERSION=$(zx --version 2>/dev/null || echo "unknown")

            if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ]; then
                print_success "ZX CLI is up to date (v$CURRENT_VERSION)."
            else
                print_warning "Updating ZX CLI from v$CURRENT_VERSION to v$LATEST_VERSION..."
                if ! npm install -g zxcli; then
                    print_error "Failed to update ZX CLI."
                else
                    print_success "ZX CLI updated successfully!"
                fi
            fi
        else
            print_info "Cannot check for updates (package may not be published yet)."
        fi
    fi

    # Success message
    echo
    echo "========================================"
    echo "    Installation Complete!"
    echo "========================================"
    echo
    echo "You can now use ZX CLI with these commands:"
    echo
    echo "  zx hello          - Test the installation"
    echo "  zx --help         - Show available commands"
    echo "  zx --version      - Show version information"
    echo
    echo "For npm script delegation in projects with package.json:"
    echo "  zx build          - Runs: npm run build"
    echo "  zx test           - Runs: npm run test"
    echo
    echo "Happy coding! 🚀"
    echo
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
