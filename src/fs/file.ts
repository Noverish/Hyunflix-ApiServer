import * as prettyBytes from 'pretty-bytes';
import * as fs from 'fs';
import { join } from 'path';

import { ARCHIVE_PATH } from '@src/config';
import { File } from '@src/models';
import { pathToURL } from '@src/utils';
const fsPromises = fs.promises;

export async function exists(path: string): Promise<boolean> {
  const realPath = join(ARCHIVE_PATH, path);
  try {
    await fsPromises.access(realPath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function isdir(path: string): Promise<boolean> {
  const realPath = join(ARCHIVE_PATH, path);
  return (await fsPromises.stat(realPath)).isDirectory();
}

export async function rename(fromPath: string, toPath: string) {
  const realFromPath = join(ARCHIVE_PATH, fromPath);
  const realToPath = join(ARCHIVE_PATH, toPath);
  return await fsPromises.rename(realFromPath, realToPath);
}

export async function readdir(path: string): Promise<File[]> {
  const realPath = join(ARCHIVE_PATH, path);
  try {
    await fsPromises.access(realPath, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    throw { msg: 'Cannot Access' };
  }

  const stat = await fsPromises.stat(realPath);
  if (stat.isFile()) {
    throw { msg: 'Cannot readdir file' };
  }

  const files = await fsPromises.readdir(realPath, { withFileTypes: true });
  const results: File[] = [];

  for (const f of files) {
    const isdir = f.isDirectory();
    const realfilePath = join(realPath, f.name);
    const filePath = join(path, f.name);

    if (isdir) {
      const file: File = {
        isdir,
        path: filePath,
        name: f.name,
        size: null,
        url: pathToURL(filePath),
      };

      results.push(file);
    } else {
      const stat = await fsPromises.lstat(realfilePath);

      results.push({
        isdir,
        path: filePath,
        name: f.name,
        size: prettyBytes(stat.size),
        url: pathToURL(filePath),
      });
    }
  }

  return results;
}
