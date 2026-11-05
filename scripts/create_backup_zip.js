const { ZipArchive } = require('archiver');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const zipName = 'NO1DOMAIN_LATEST_COMPLETE_BACKUP.zip';
const zipPath = path.join(rootDir, zipName);
const publicZipPath = path.join(rootDir, 'public', zipName);
const easyPublicZipPath = path.join(rootDir, 'public', 'website-latest.zip');
const downloadsZipPath = path.join(process.env.USERPROFILE || 'C:\\Users\\monua', 'Downloads', zipName);

console.log('Generating POSIX Linux-compatible deployment ZIP archive...');

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

const output = fs.createWriteStream(zipPath);
const archive = new ZipArchive({ zlib: { level: 9 } });

archive.pipe(output);

output.on('close', () => {
  const sizeMB = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 ZIP ARCHIVE CREATED SUCCESSFULLY (${sizeMB} MB)`);

  // Copy to public for direct web browser download
  fs.copyFileSync(zipPath, publicZipPath);
  fs.copyFileSync(zipPath, easyPublicZipPath);
  console.log('1. Saved to public/ for browser download: /website-latest.zip');

  // Copy to Windows Downloads folder
  try {
    if (fs.existsSync(path.dirname(downloadsZipPath))) {
      fs.copyFileSync(zipPath, downloadsZipPath);
      console.log('2. Copied to Windows Downloads:', downloadsZipPath);
    }
  } catch (e) {
    console.warn('Could not copy to Downloads:', e.message);
  }
  console.log('3. Root Workspace file:', zipPath);
});

archive.on('error', (err) => {
  console.error('Archive error:', err);
  process.exit(1);
});

function addDirectoryRecursive(localDir, zipPrefix) {
  const items = fs.readdirSync(localDir);
  // Ensure the directory itself is registered with Unix mode 0755 and forward slash
  if (zipPrefix) {
    const dirEntryName = zipPrefix.replace(/\\/g, '/').replace(/\/+$/, '') + '/';
    archive.append(null, { name: dirEntryName, mode: 0o755 });
  }

  for (const item of items) {
    const fullPath = path.join(localDir, item);
    const posixRel = zipPrefix ? `${zipPrefix}/${item}`.replace(/\\/g, '/') : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      addDirectoryRecursive(fullPath, posixRel);
    } else {
      archive.file(fullPath, { name: posixRel, mode: 0o644 });
    }
  }
}

// 1. Add Source Folders with explicit Linux permissions
console.log('Adding src/...');
addDirectoryRecursive(path.join(rootDir, 'src'), 'src');

console.log('Adding prisma/...');
addDirectoryRecursive(path.join(rootDir, 'prisma'), 'prisma');

console.log('Adding scripts/...');
addDirectoryRecursive(path.join(rootDir, 'scripts'), 'scripts');

// 2. Add public/ directory (excluding old large zip archives)
console.log('Adding public/...');
const pubLocal = path.join(rootDir, 'public');
archive.append(null, { name: 'public/', mode: 0o755 });
for (const item of fs.readdirSync(pubLocal)) {
  if (item.endsWith('.zip')) continue; // Skip existing zip files to avoid recursion/bloat
  const fullPath = path.join(pubLocal, item);
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    addDirectoryRecursive(fullPath, `public/${item}`);
  } else {
    archive.file(fullPath, { name: `public/${item}`, mode: 0o644 });
  }
}

// 3. Add root config files
const rootFiles = [
  'package.json',
  'package-lock.json',
  'next.config.js',
  'tailwind.config.ts',
  'postcss.config.js',
  'tsconfig.json',
  'server.js',
  'dev.db',
  '.env',
  '.env.example',
  '.env.production',
  'HOSTINGER_DEPLOY_GUIDE.md',
  'README_BACKUP_GUIDE.md',
  'demo_domains.json'
];

console.log('Adding root configuration and build files...');
for (const file of rootFiles) {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    archive.file(fullPath, { name: file, mode: 0o644 });
  }
}

// Finalize archive
archive.finalize();
