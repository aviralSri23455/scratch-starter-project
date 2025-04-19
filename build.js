const { execSync } = require('child_process');

console.log('Building project for production...');

try {
  // Run webpack production build
  console.log('Running webpack build...');
  execSync('npx webpack --config webpack.prod.js', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}