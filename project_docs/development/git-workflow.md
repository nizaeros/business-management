# Git Workflow Guidelines

## Overview
This document outlines our Git workflow for the Business Management project, ensuring consistent and reliable development processes.

## Branch Structure
- `staging`: Primary deployment branch for Vercel
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

# Merge to staging and deploy
git checkout staging
git merge feature/your-feature-name
git push origin staging
vercel --prod  # Deploy to Vercel staging environment
```

## Deployment Strategy

### Staging Environment (Vercel)
- All deployments go to the staging environment
- The `staging` branch is our primary deployment branch
- Automatic deployments are triggered on push to `staging`
- Manual deployments can be done using `vercel --prod`

### Production Considerations
- Main branch deployment is currently not configured
- Production deployment will be set up after:
  1. Database setup and migration
  2. Environment configuration
  3. Security review
  4. Performance testing

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
- Never commit directly to `staging`
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
For urgent fixes in staging:
```powershell
git checkout staging
git pull origin staging
git checkout -b hotfix/critical-security-fix
# After fix and testing
git checkout staging
git merge hotfix/critical-security-fix
git push origin staging
vercel --prod  # Deploy fix to staging
```

### Deployment Commands
```powershell
# Deploy to staging
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls
```

## Vercel Deployment Guidelines

### Pre-deployment Checklist
1. All tests passing
2. Code reviewed and approved
3. Documentation updated
4. Environment variables configured
5. Database migrations ready

### Post-deployment Verification
1. Check deployment status in Vercel dashboard
2. Verify feature functionality
3. Monitor error logs
4. Check performance metrics
5. Validate database operations
