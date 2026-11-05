const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('Unzipping public/NO1DOMAIN_SOURCE_BACKUP_COMPLETE.zip...')
execSync('powershell -Command "Expand-Archive -Path public/NO1DOMAIN_SOURCE_BACKUP_COMPLETE.zip -DestinationPath test_unzip_verify -Force"')

process.env.DATABASE_URL = 'file:../test_unzip_verify/dev.db'
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

prisma.listing.findMany().then(list => {
  console.log('Listings count in unzipped dev.db:', list.length)
  list.forEach(l => {
    console.log(` - ${l.domain} | ${l.status} | Rs ${l.currentBid}`)
  })
  // clean up test folder
  try {
    fs.rmSync(path.resolve(__dirname, '../test_unzip_verify'), { recursive: true, force: true })
    fs.rmSync(path.resolve(__dirname, '../test_unzip'), { recursive: true, force: true })
  } catch (e) {}
}).catch(console.error)
