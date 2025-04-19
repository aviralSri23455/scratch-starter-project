# Deploying to Render

This document provides instructions for deploying this Scratch Starter Project to Render.

## Prerequisites

- A Render account (sign up at https://render.com if you don't have one)
- Git repository with your project code

## Deployment Steps

1. **Connect your repository to Render**
   - Log in to your Render dashboard
   - Click "New" and select "Static Site"
   - Connect your Git repository

2. **Configure your site**
   - Name: scratch-starter-project (or your preferred name)
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Environment: Node
   - Node Version: 16.x (or your preferred version)

3. **Environment Variables**
   - Add `NODE_ENV` = `production`

4. **Deploy**
   - Click "Create Static Site"
   - Render will automatically build and deploy your site

## Automatic Deployments

Render automatically deploys your site when you push changes to your repository's main branch.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Render dashboard
2. Ensure your build command is correctly set to `npm run build`
3. Verify that the publish directory is set to `dist`
4. Make sure all dependencies are correctly listed in your package.json

## Local Testing

Before deploying, test your build locally:

```
npm run build
```

This should generate the `dist` directory with your built application.