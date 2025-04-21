const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building project for production...');

try {
  // Run webpack production build
  console.log('Running webpack build...');
  execSync('npx webpack --config webpack.prod.js', { stdio: 'inherit' });
  
  // Ensure netlify.toml is copied to dist
  console.log('Ensuring all files are copied to dist folder...');
  const publicDir = path.resolve(__dirname, 'public');
  const distDir = path.resolve(__dirname, 'dist');
  
  // Copy any missing files from public to dist
  if (fs.existsSync(publicDir)) {
    const copyFile = (file) => {
      const sourcePath = path.join(publicDir, file);
      const destPath = path.join(distDir, file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        
        fs.readdirSync(sourcePath).forEach(childFile => {
          copyFile(path.join(file, childFile));
        });
      } else {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${file} to dist folder`);
      }
    };
    
    fs.readdirSync(publicDir).forEach(copyFile);
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}