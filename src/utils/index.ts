export * from './subtitle';
export const jwt = require('./jwt');

const fs = require('fs').promises;
const path = require('path');

async function walk(dir) {
  let files = await fs.readdir(dir);
  files = await Promise.all(files.map(async (file) => {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) return walk(filePath);
    if (stats.isFile()) return filePath;
  }));

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}
