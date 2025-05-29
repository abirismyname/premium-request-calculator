# DevContainer Setup for GitHub Copilot Premium Calculator

This directory contains the DevContainer configuration for the GitHub Copilot Premium Requests Calculator project.

## What's Included

- **Node.js 20** with TypeScript support
- **Git** and **GitHub CLI** pre-installed
- **VS Code Extensions**:
  - GitHub Copilot & Copilot Chat
  - TypeScript support
  - ESLint & Prettier
  - Auto Rename Tag
  - Path IntelliSense
- **Port Forwarding**:
  - Port 3000: React Frontend
  - Port 5001: Express Backend
- **Volume Mounts** for `node_modules` to improve performance

## Quick Start

1. **Open in DevContainer**:
   - Open the project in VS Code
   - Click "Reopen in Container" when prompted
   - Or use Command Palette: `Dev Containers: Reopen in Container`

2. **Start Development**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api

## Files Explained

- `devcontainer.json` - Main configuration file
- `Dockerfile` - Custom Docker image (optional)
- `docker-compose.yml` - Multi-service setup (optional)
- `post-create.sh` - Setup script run after container creation

## Customization

You can modify the `devcontainer.json` file to:
- Add more VS Code extensions
- Install additional tools
- Configure different port mappings
- Set environment variables

## Troubleshooting

**Ports already in use?**
- Check if local development servers are running
- Stop them before starting the DevContainer

**Permission issues?**
- The container runs as the `node` user
- Files are mounted with appropriate permissions

**Performance issues?**
- Node modules are stored in named volumes for better performance
- Consider increasing Docker resources if needed

## Environment Variables

The setup automatically creates:
- `.env` - Backend configuration
- `client/.env` - Frontend configuration

These files are created with default development settings if they don't exist.
