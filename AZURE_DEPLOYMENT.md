# Azure Static Web Apps Deployment Guide

This guide will help you migrate from Vercel to Azure Static Web Apps for your frontend deployment.

## Prerequisites

1. An Azure account with an active subscription
2. Your project code in a GitHub repository
3. Azure CLI installed (optional, for advanced configuration)

## Configuration Files Added

The following files have been added to your project to support Azure Static Web Apps:

1. `staticwebapp.config.json` - Configuration for routes and settings
2. `.github/workflows/azure-static-web-apps.yml` - GitHub Actions workflow
3. `frontend/.env.production` - Production environment variables
4. `test-local.sh` - Script to test the setup locally

## Deployment Steps

### 1. Create an Azure Static Web App

1. Go to the [Azure Portal](https://portal.azure.com)
2. Search for "Static Web Apps" and click "Create"
3. Fill in the basic details:
   - Subscription: Your Azure subscription
   - Resource Group: Create new or use existing
   - Name: Choose a name for your app (e.g., stock-analysis-app)
   - Hosting Plan: Free (or Standard for production)
   - Region: Choose the closest to your users

4. Source Control details:
   - Source: GitHub
   - Organization: Your GitHub organization/username
   - Repository: Your repository name
   - Branch: azure-functions (or your main branch)

5. Build details:
   - Build Preset: Custom
   - App location: `/frontend`
   - API location: `/azure-functions-backend`
   - Output location: `dist`

6. Click "Review + create" and then "Create"

### 2. Update Environment Variables

After deployment, you'll need to add environment variables in the Azure Portal:

1. Go to your Static Web App resource
2. Click on "Configuration" in the left menu
3. Add the following environment variables:
   - AZURE_API_KEY
   - AZURE_ENDPOINT
   - AZURE_MODEL_NAME
   - NEWS_API_KEY
   - SECRET_KEY

### 3. Testing Locally

Before deploying, you can test the setup locally:

```bash
# Make the test script executable
chmod +x test-local.sh

# Run the test script
./test-local.sh
```

This will start both the frontend and backend servers and ensure they can communicate properly.

## Troubleshooting

### CORS Issues

If you encounter CORS issues:

1. Ensure your backend's CORS settings include your Azure Static Web App URL
2. Check the `staticwebapp.config.json` file for proper API routing
3. Verify that your frontend is using the correct API URL

### Deployment Failures

If GitHub Actions deployment fails:

1. Check the GitHub Actions logs for specific errors
2. Verify that your build commands work locally
3. Ensure all required environment variables are set

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions for Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/github-actions-workflow)
- [Troubleshooting Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/troubleshooting) 