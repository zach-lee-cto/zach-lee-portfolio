# Zach Lee's Portfolio Website

A professional portfolio website showcasing my projects, skills, and experience.

## Auto-Deployment System

This portfolio is set up with an automatic deployment system that updates the live site whenever you make changes to the files.

### How It Works

The auto-deployment system works through Git hooks:

1. **Git Pre-commit Hook**: Automatically adds all your changed files before a commit
2. **Git Post-commit Hook**: Automatically pushes changes to GitHub after each commit
3. **GitHub Actions Workflow**: Deploys the site to GitHub Pages when changes are pushed to main

### Usage Instructions

Simply make changes to your website files and commit them:

```bash
# After making changes, just create a commit
git commit -m "Your commit message"

# The hooks will automatically:
# 1. Add all files (pre-commit)
# 2. Push to GitHub (post-commit)
# 3. Trigger GitHub Actions to deploy
```

No need to manually run `git add` or `git push` - it's all automated!

## Development Guidelines

- All changes made locally will be automatically deployed
- The site is optimized for both desktop and mobile viewing (including iOS)
- To add new projects, simply modify the project cards in index.html 