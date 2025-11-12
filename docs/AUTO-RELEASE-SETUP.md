# Auto-Release System Setup

## Overview

This project is configured to automatically create GitHub releases every **3 commits** to the `main` branch.

## How It Works

1. **Trigger**: Every push to the `main` branch triggers the workflow
2. **Commit Counting**: The workflow counts commits since the last release tag
3. **Release Creation**: When 3 or more commits are detected, a new release is automatically created
4. **Versioning**: Releases use the version from `version.json` (e.g., `v0.0.4`)

## Workflow Details

- **Location**: `.github/workflows/auto-release.yml`
- **Trigger**: Push to `main` branch
- **Threshold**: 3 commits
- **Version Source**: `version.json`

## Current Status

- ✅ Workflow is active and pushed to GitHub
- ✅ Initial release tag created: `v0.0.4`
- ✅ Next release will be created after 3 more commits

## Release Process

When 3 commits are reached:

1. Workflow runs automatically
2. Creates a new tag: `v{version}` (e.g., `v0.0.5`)
3. Creates a GitHub Release with:
   - Release title: "Release v{version}"
   - Release notes including commit count and changelog link
   - Marked as latest release

## Monitoring

- View workflow runs: https://github.com/marlink/simple-2/actions
- View releases: https://github.com/marlink/simple-2/releases
- Each workflow run shows:
  - Commit count since last release
  - Whether a release was created
  - Summary in GitHub Actions UI

## Manual Release (if needed)

If you need to create a release manually before 3 commits:

```bash
# Update version
node scripts/increment-version.js

# Create tag
git tag -a v$(node -p "require('./version.json').version") -m "Manual release"

# Push tag
git push origin --tags

# Create release via GitHub CLI
gh release create v$(node -p "require('./version.json').version") \
  --title "Release v$(node -p "require('./version.json').version")" \
  --notes "Manual release"
```

## Customization

To change the commit threshold (currently 3):

Edit `.github/workflows/auto-release.yml` line 58:
```yaml
if [ $COMMIT_COUNT_INT -ge 3 ]; then  # Change 3 to your desired number
```

## Notes

- The workflow uses the version from `version.json`
- Releases are created automatically - no manual intervention needed
- Each release includes a link to the full commit history
- The workflow runs on every push, but only creates releases when threshold is met

