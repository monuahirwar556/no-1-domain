const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const tempDir = path.join(rootDir, 'temp_backup_staging');

// Clean temp staging dir
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Copy function with exclusions
function copyDir(src, dest, excludeExts = ['.zip', '.log'], excludeDirs = ['node_modules', '.next', '.git', 'temp_backup_staging', 'scratch']) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (excludeDirs.includes(entry.name)) continue;
      copyDir(srcPath, destPath, excludeExts, excludeDirs);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (excludeExts.includes(ext)) continue;
      if (entry.name.endsWith('.db-journal') || entry.name === 'dev.db') {
        // try copy safely or skip locked dev.db
        try {
          fs.copyFileSync(srcPath, destPath);
        } catch {
          console.warn('Skipped locked db file:', entry.name);
        }
      } else {
        try {
          fs.copyFileSync(srcPath, destPath);
        } catch (e) {
          console.warn('Error copying:', srcPath, e.message);
        }
      }
    }
  }
}

console.log('Copying project files to staging directory...');
copyDir(rootDir, tempDir);

console.log('Creating ZIP archive...');
const zipPublic = path.join(rootDir, 'public', 'NO1_LATEST_COMPLETE_PROJECT.zip');
const zipRoot = path.join(rootDir, 'NO1_LATEST_COMPLETE_PROJECT.zip');

// Use PowerShell Compress-Archive on tempDir
const psCmd = `powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipPublic}' -Force; Copy-Item -Path '${zipPublic}' -Destination '${zipRoot}' -Force"`;
execSync(psCmd, { stdio: 'inherit' });

// Clean tempDir
fs.rmSync(tempDir, { recursive: true, force: true });

const stats = fs.statSync(zipPublic);
console.log(`Successfully created ZIP archive: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
console.log('Saved to: ' + zipPublic);
console.log('Saved to: ' + zipRoot);
