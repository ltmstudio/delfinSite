// Script to copy public folder for standalone build
const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    
    if (fs.lstatSync(fromPath).isFile()) {
      fs.copyFileSync(fromPath, toPath);
      console.log(`Copied: ${fromPath} -> ${toPath}`);
    } else {
      copyFolderSync(fromPath, toPath);
    }
  });
}

const publicDir = path.join(process.cwd(), 'public');
const standalonePublicDir = path.join(process.cwd(), '.next', 'standalone', 'public');

console.log('Copying public folder to standalone build...');
copyFolderSync(publicDir, standalonePublicDir);
console.log('✅ Public folder copied successfully!');

