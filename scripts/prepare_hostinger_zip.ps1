# Script to create production-ready zip for Hostinger deployment
$root = "D:\monu\doman website"
$staging = "$root\hostinger_deploy_temp"
$zipFile = "$root\DUKANRANT_HOSTINGER_DEPLOY.zip"

Write-Host "Creating staging directory..."
if (Test-Path $staging) { Remove-Item -Recurse -Force $staging }
New-Item -ItemType Directory -Path $staging | Out-Null

# Copy root config files
$files = @(
    "package.json",
    "server.js",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.js",
    "next.config.js",
    "next-env.d.ts",
    ".env.example",
    ".env",
    "HOSTINGER_DEPLOY_GUIDE.md",
    "dev.db"
)

foreach ($f in $files) {
    $srcPath = Join-Path $root $f
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $staging
        Write-Host "Copied $f"
    }
}

# Copy directories
$dirs = @("src", "public", "prisma", "scripts")
foreach ($d in $dirs) {
    $srcDir = Join-Path $root $d
    if (Test-Path $srcDir) {
        Copy-Item -Path $srcDir -Destination $staging -Recurse
        Write-Host "Copied directory $d"
    }
}

# Create Source-Only Zip (for Hostinger Deployments Auto-Builder)
$sourceZip = "$root\DUKANRANT_SOURCE_DEPLOY.zip"
if (Test-Path $sourceZip) { Remove-Item -Force $sourceZip }
Write-Host "Compressing source zip to $sourceZip..."
Compress-Archive -Path "$staging\*" -DestinationPath $sourceZip -CompressionLevel Optimal
$sourceSize = (Get-Item $sourceZip).Length / 1KB
Write-Host "Created source zip: $sourceZip ($([math]::Round($sourceSize, 1)) KB)"

# Copy .next excluding cache
if (Test-Path "$root\.next") {
    Write-Host "Copying .next build assets (excluding cache)..."
    $destNext = "$staging\.next"
    New-Item -ItemType Directory -Path $destNext | Out-Null
    
    Get-ChildItem -Path "$root\.next" | Where-Object { $_.Name -ne "cache" } | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $destNext -Recurse
    }
    Write-Host "Copied .next production build"
}

# Create Full Prebuilt Zip (for Hostinger File Manager extraction)
if (Test-Path $zipFile) { Remove-Item -Force $zipFile }
Write-Host "Compressing full prebuilt zip to $zipFile..."
Compress-Archive -Path "$staging\*" -DestinationPath $zipFile -CompressionLevel Optimal

# Cleanup staging
Remove-Item -Recurse -Force $staging

$zipSize = (Get-Item $zipFile).Length / 1MB
Write-Host "SUCCESS!"
Write-Host "1. Source-Only Zip (for Deployments tool): $sourceZip"
Write-Host "2. Full Prebuilt Zip (for File Manager): $zipFile ($([math]::Round($zipSize, 2)) MB)"
