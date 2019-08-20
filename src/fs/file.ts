import * as prettyBytes from 'pretty-bytes';
import * as fs from 'fs';
import { join, parse } from 'path';

const fsPromises = fs.promises;

export interface File {
  path: string;
  name: string;
  isdir: boolean;
  size: string;
}

export async function exists(path: string): Promise<boolean> {
  try {
    await fsPromises.access(path, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

export async function isdir(path: string): Promise<boolean> {
  return (await fsPromises.stat(path)).isDirectory();
}

export async function getFileList(path: string): Promise<File[]> {
  try {
    await fsPromises.access(path, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    throw { msg: 'Cannot Access' };
  }

  const stat = await fsPromises.stat(path);
  if (stat.isFile()) {
    throw { msg: 'Cannot readdir file' };
  }

  const files = await fsPromises.readdir(path, { withFileTypes: true });
  const results: File[] = [];

  for (const f of files) {
    const isdir = f.isDirectory();
    const filePath = join(path, f.name);

    if (isdir) {
      const file: File = {
        isdir,
        path: filePath,
        name: f.name,
        size: null,
      };

      results.push(file);
    } else {
      const stat = fs.statSync(filePath);

      results.push({
        isdir,
        path: filePath,
        name: f.name,
        size: prettyBytes(stat.size),
      });
    }
  }

  return results;
}

export function walk(path): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const toGoList: string[] = [path];
    const filePaths: string[] = [];
    
    while(true) {
      if(toGoList.length === 0) {
        break;
      }
      
      const dirPath = toGoList.shift();
      const files = fs.readdirSync(dirPath).sort();
      for(const file of files) {
        const filePath = join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          toGoList.push(filePath);
        } else if(stat.isFile()) {
          filePaths.push(filePath);
        }
      }
    }
    
    resolve(filePaths);
  });
}

export function walkDir(path): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const toGoList = [path];
    const dirList = [];
    
    while(true) {
      if(toGoList.length === 0) {
        break;
      }
      
      const dirPath = toGoList.shift();
      const files = fs.readdirSync(dirPath).sort();
      let hasDir = false;
      for(const file of files) {
        const filePath = join(dirPath, file);
        if(fs.statSync(filePath).isDirectory()) {
          hasDir = true;
          toGoList.push(filePath);
        }
      }
      
      if(!hasDir) {
        dirList.push(dirPath);
      }
    }
    
    resolve(dirList);
  });
}