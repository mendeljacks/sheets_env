// Increment version number in package.json using fs
const fs = require('fs')

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
const version = packageJson.version
const newVersion = version.split('.').map(x => Number(x)).map((x, i) => i == 2 ? x + 1 : x).join('.')
fs.writeFileSync('./package.json', JSON.stringify({ ...packageJson, version: newVersion }, null, 4))