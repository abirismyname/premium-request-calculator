# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Premium Request Calculator project.

## Workflows Overview

### 🔨 CI (ci.yml)
- **Triggers**: Push/PR to main/develop branches
- **Purpose**: Continuous Integration - builds and tests the application
- **Features**:
  - Multi-Node.js version testing (18.x, 20.x)
  - Backend test execution with coverage
  - Frontend build verification
  - Artifact generation for deployment
  - Coverage reporting to Codecov

### 🔍 Lint (lint.yml)
- **Triggers**: Push/PR to main/develop branches
- **Purpose**: Code quality and syntax checking
- **Features**:
  - Backend JavaScript linting
  - Frontend React/TypeScript linting (via build process)
  - Security vulnerability scanning with npm audit

### 🛡️ CodeQL (codeql.yml)
- **Triggers**: Push/PR to main/develop, weekly schedule
- **Purpose**: Advanced security analysis
- **Features**:
  - Static code analysis for JavaScript and TypeScript
  - Security vulnerability detection
  - Weekly automated scans

### 📦 Dependency Review (dependency-review.yml)
- **Triggers**: Pull requests to main/develop
- **Purpose**: Dependency security scanning
- **Features**:
  - License compliance checking
  - Vulnerability assessment for new dependencies
  - Automated dependency auditing

### 🚀 Release (release.yml)
- **Triggers**: Git tags (v*), manual workflow dispatch
- **Purpose**: Automated releases
- **Features**:
  - Release artifact creation
  - Changelog generation
  - GitHub release publishing
  - Asset upload

### ⚡ Performance (performance.yml)
- **Triggers**: Push to main, PR to main, weekly schedule
- **Purpose**: Performance monitoring
- **Features**:
  - API endpoint performance testing with autocannon
  - Frontend performance analysis with Lighthouse
  - Weekly performance regression checks

## Setup Requirements

### Secrets
Some workflows require the following secrets to be configured in the repository:

- `CODECOV_TOKEN` (optional): For uploading coverage reports to Codecov
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### Badges
You can add these badges to your README.md:

```markdown
[![CI](https://github.com/shundor/premium-request-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/shundor/premium-request-calculator/actions/workflows/ci.yml)
[![CodeQL](https://github.com/shundor/premium-request-calculator/actions/workflows/codeql.yml/badge.svg)](https://github.com/shundor/premium-request-calculator/actions/workflows/codeql.yml)
[![Lint](https://github.com/shundor/premium-request-calculator/actions/workflows/lint.yml/badge.svg)](https://github.com/shundor/premium-request-calculator/actions/workflows/lint.yml)
```

## Workflow Configuration

### Branch Protection
Consider setting up branch protection rules for `main` branch requiring:
- Status checks from CI workflow
- Up-to-date branches before merging
- Review requirements

### Environment Configuration
For production deployments, consider creating GitHub Environments with:
- Deployment protection rules
- Environment-specific secrets
- Manual approval requirements

## Customization

### Adding New Workflows
1. Create a new `.yml` file in this directory
2. Follow GitHub Actions syntax
3. Test locally where possible
4. Update this documentation

### Modifying Existing Workflows
1. Update the workflow file
2. Test changes in a feature branch
3. Update documentation if triggers or features change
4. Consider backward compatibility

## Local Testing

Some workflow components can be tested locally:

```bash
# Run tests
npm test

# Build application
npm run build

# Run linting (manual check)
cd client && npm run build

# Security audit
npm audit
cd client && npm audit
```

## Troubleshooting

### Common Issues
1. **Node.js version mismatches**: Update matrix versions in CI workflow
2. **Build failures**: Check package.json scripts and dependencies
3. **Permission errors**: Verify workflow permissions section
4. **Secret access**: Ensure secrets are properly configured

### Debug Tips
- Use `actions/upload-artifact` to inspect build outputs
- Add debug steps with `run: echo` commands
- Check workflow logs in GitHub Actions tab
- Test workflows on feature branches before merging