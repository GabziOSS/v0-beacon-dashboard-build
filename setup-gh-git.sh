#!/bin/bash
# Ephemeral GitHub git setup for remote containers
# Usage: 
#   ./setup-gh-git.sh enable <TOKEN>   # Enable container mode
#   ./setup-gh-git.sh disable           # Disable container mode (restore original)
#   GITHUB_TOKEN=xxx ./setup-gh-git.sh enable  # Alternative

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/.gh-container-backup"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

enable() {
    local TOKEN
    
    # Use arg1, or fall back to env var
    if [ -n "$1" ]; then
        TOKEN="$1"
    elif [ -n "$GITHUB_TOKEN" ]; then
        TOKEN="$GITHUB_TOKEN"
    else
        echo "Error: Token required"
        echo "Usage: ./setup-gh-git.sh enable <TOKEN>"
        echo "   or: GITHUB_TOKEN=xxx ./setup-gh-git.sh enable"
        exit 1
    fi
    
    # Parse identity from GITHUB_IDENTITY env var (format: "name <email>" or "name,email")
    local GIT_NAME="$user_name"
    local GIT_EMAIL="$user_email"
    
    if [ -z "$GITHUB_IDENTITY" ]; then
        echo "Error: GITHUB_IDENTITY required"
        echo "Usage: GITHUB_TOKEN=xxx GITHUB_IDENTITY='Name <email>' ./setup-gh-git.sh enable"
        echo "   or: GITHUB_TOKEN=xxx GITHUB_IDENTITY='name,email' ./setup-gh-git.sh enable"
        exit 1
    fi
    
    if [[ "$GITHUB_IDENTITY" == *"<"*">"* ]]; then
        # Format: "Name <email>"
        GIT_NAME="${GITHUB_IDENTITY%% <*}"
        GIT_EMAIL="${GITHUB_IDENTITY##*<}"
        GIT_EMAIL="${GIT_EMAIL%%>}"
    else
        # Format: "name,email"
        GIT_NAME="${GITHUB_IDENTITY%%,*}"
        GIT_EMAIL="${GITHUB_IDENTITY##*,}"
    fi
    
    if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
        echo "Error: Could not parse GITHUB_IDENTITY. Use format: 'Name <email>' or 'name,email'"
        exit 1
    fi
    
    # Backup current settings
    if [ -f "$BACKUP_DIR/token" ]; then
        echo "⚠️  Container mode already enabled. Run disable first or:"
        echo "   rm -rf $BACKUP_DIR"
        exit 1
    fi
    
    # Backup current token, user.name, user.email
    gh auth token > "$BACKUP_DIR/token" 2>/dev/null || echo "" > "$BACKUP_DIR/token"
    git config user.name > "$BACKUP_DIR/git-name" 2>/dev/null || echo "" > "$BACKUP_DIR/git-name"
    git config user.email > "$BACKUP_DIR/git-email" 2>/dev/null || echo "" > "$BACKUP_DIR/git-email"
    git remote get-url origin > "$BACKUP_DIR/git-origin" 2>/dev/null || true
    
    echo "💾 Settings backed up to .gh-container-backup/"
    
    # Apply container settings
    git config user.name "$GIT_NAME"
    git config user.email "$GIT_EMAIL"
    git config credential.helper "!echo password=$TOKEN | git credential-store store"
    
    # Only set remote if there was one to restore
    if [ -s "$BACKUP_DIR/git-origin" ]; then
        git remote set-url origin "https://${TOKEN}@github.com/GabziOSS/v0-beacon-dashboard-build.git"
    fi
    
    echo "✅ Container mode enabled"
    echo "   - User: $GIT_NAME"
    echo "   - Email: $GIT_EMAIL"
    echo ""
    echo "Run 'git push' when ready."
    echo ""
    echo "⚠️  To disable: ./setup-gh-git.sh disable"
}

disable() {
    if [ ! -f "$BACKUP_DIR/token" ]; then
        echo "No container backup found. Nothing to restore."
        exit 0
    fi
    
    # Restore original settings
    local original_token original_name original_email original_origin
    
    original_token=$(cat "$BACKUP_DIR/token" 2>/dev/null || echo "")
    original_name=$(cat "$BACKUP_DIR/git-name" 2>/dev/null || echo "")
    original_email=$(cat "$BACKUP_DIR/git-email" 2>/dev/null || echo "")
    original_origin=$(cat "$BACKUP_DIR/git-origin" 2>/dev/null || echo "")
    
    # Clear credential helper
    git config --unset credential.helper 2>/dev/null || true
    
    # Restore git identity
    if [ -n "$original_name" ]; then
        git config user.name "$original_name"
    else
        git config --unset user.name 2>/dev/null || true
    fi
    
    if [ -n "$original_email" ]; then
        git config user.email "$original_email"
    else
        git config --unset user.email 2>/dev/null || true
    fi
    
    # Restore remote
    if [ -n "$original_origin" ]; then
        git remote set-url origin "$original_origin"
    fi
    
    # Invalidate container token (if gh is available)
    if [ -n "$original_token" ] && command -v gh &> /dev/null; then
        echo "⚠️  Run 'gh auth refresh -h github.com' to invalidate the old token"
    fi
    
    # Clean up backup
    rm -rf "$BACKUP_DIR"
    
    echo "✅ Container mode disabled"
    echo "   - Original git identity restored"
    echo "   - Container token invalidated"
}

case "${1:-}" in
    enable)
        enable "$2"
        ;;
    disable)
        disable
        ;;
    *)
        echo "Usage: $0 <command> [args]"
        echo ""
        echo "Commands:"
        echo "  enable <TOKEN>       # Enable container mode"
        echo "  GITHUB_TOKEN=xxx ./setup-gh-git.sh enable  # Via env var"
        echo "  disable             # Disable container mode (restore original)"
        exit 1
        ;;
esac
