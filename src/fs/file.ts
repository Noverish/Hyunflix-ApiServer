import * as prettyBytes from 'pretty-bytes';
import * as fs from 'fs';
import { join, parse } from 'path';

import { FILE_SERVER } from '@src/config';
const fsPromises = fs.promises;

export interface File {
  url: string;
  path: string;
  name: string;
  isdir: boolean;
  size: string;
}

export async function exists(path: string, root: string): Promise<boolean> {
  const realPath = join(root, path);
  try {
    await fsPromises.access(realPath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function isdir(path: string, root: string): Promise<boolean> {
  const realPath = join(root, path);
  return (await fsPromises.stat(realPath)).isDirectory();
}

export async function rename(fromPath: string, toPath: string, root: string) {
  const realFromPath = join(root, fromPath);
  const realToPath = join(root, toPath);
  return await fsPromises.rename(realFromPath, realToPath);
}

export async function getFileList(path: string, root: string): Promise<File[]> {
  const realPath = join(root, path);
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
        url: FILE_SERVER + filePath,
      };

      results.push(file);
    } else {
      const stat = await fsPromises.lstat(realfilePath);

      results.push({
        isdir,
        path: filePath,
        name: f.name,
        size: prettyBytes(stat.size),
        url: FILE_SERVER + filePath,
      });
    }
  }

  return results;
}
