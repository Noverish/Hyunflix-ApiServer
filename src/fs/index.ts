export * from './file';
export * from './subtitle';

import { promises as fsPromises } from 'fs';
import { join } from 'path';

export async function walk(path): Promise<string[]> {
  const toGoList: string[] = [path];
  const filePaths: string[] = [];

  while (toGoList.length > 0) {
    const dirPath = toGoList.shift();
    const files = (await fsPromises.readdir(dirPath)).sort();
    for (const file of files) {
      const filePath = join(dirPath, file);
      const stat = await fsPromises.stat(filePath);
      if (stat.isDirectory()) {
        toGoList.push(filePath);
      } else if (stat.isFile()) {
        filePaths.push(filePath);
      }
    }
  }

  return filePaths;
}
