# Git Workflow Guidelines

## Overview
This document outlines our Git workflow for the Business Management project, ensuring consistent and reliable development processes.

## Branch Structure
- `main`: Production-ready code
- `staging`: Testing and integration branch
- `feature/*`: Individual feature branches

## Development Workflow

### 1. Starting New Work
Always start new work from the `staging` branch:
```powershell
# Ensure you're on staging and it's up to date
git checkout staging
git pull origin staging

# Create and switch to a feature branch
git checkout -b feature/your-feature-name
```

### 2. During Development
Regular commits and keeping your branch updated:
```powershell
# Commit your changes
git add .
git commit -m "descriptive message"

# Keep feature branch updated with staging
git checkout staging
git pull origin staging
git checkout feature/your-feature-name
git merge staging
```

### 3. Completing Features
Process for completing and merging features:
```powershell
# Push feature to remote
git push origin feature/your-feature-name

# Merge to staging
git checkout staging
git merge feature/your-feature-name
git push origin staging
```

### 4. Production Release
After thorough testing on staging:
```powershell
# Update main with staging changes
git checkout main
git pull origin main
git merge staging
git push origin main
```

## Best Practices

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Update, Fix, Refactor, etc.)
- Keep messages concise but informative
- Example: "Add user authentication middleware"

### Branch Naming
- Features: `feature/feature-name`
- Bug fixes: `bugfix/issue-description`
- Hotfixes: `hotfix/urgent-fix-description`

### Code Review Guidelines
1. All changes must be reviewed before merging to staging
2. Keep changes focused and atomic
3. Test thoroughly on your feature branch
4. Update documentation when necessary

### Safety Measures
- Never commit directly to `main` or `staging`
- Always create feature branches for new work
- Keep branches up to date with staging
- Delete feature branches after merging

## Common Scenarios

### Bug Fixes
Follow the same process as features but use the `bugfix/` prefix:
```powershell
git checkout staging
git pull origin staging
git checkout -b bugfix/login-validation
```

### Hotfixes
For urgent production fixes:
```powershell
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix
# After fix
git checkout main
git merge hotfix/critical-security-fix
git push origin main
git checkout staging
git merge main
git push origin staging
```

### Resolving Conflicts
If you encounter merge conflicts:
1. Don't panic - conflicts are normal
2. Understand the changes causing conflicts
3. Resolve conflicts in your code editor
4. Test thoroughly after resolution
5. Commit the resolved changes

## Automation Support
The repository is configured to:
- Prevent direct pushes to `main`
- Require pull request reviews
- Run automated tests on pull requests

## Need Help?
If you're unsure about any Git operations or encounter issues:
1. Check this documentation first
2. Ask team members for guidance
3. Never force push unless absolutely necessary and team is informed

Remember: This workflow is designed to maintain code quality and prevent conflicts. Following these guidelines helps keep our development process smooth and efficient.
