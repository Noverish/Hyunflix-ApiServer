import * as fs from 'fs';
import { join, parse } from 'path';

import { ffprobe, FFProbe } from '@src/ffmpeg';
const fsPromises = fs.promises;

function walkOnlyDir(path): Promise<string[]> {
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

async function parseMovie(dirPath) {
  const files = fs.readdirSync(dirPath);
  const filePaths = files.map((f) => join(dirPath, f));
  
  const movieName = parse(dirPath).name;
  
  for(const filePath of filePaths) {
    const parsed = parse(filePath);
    
    if(parsed.ext === '.mp4') {
      const probed: FFProbe = await ffprobe(filePath);
      console.log(movieName, probed.duration);
    }
  }
}

export async function asdf(movieFolderPath: string) {
  const dirList = await walkOnlyDir(movieFolderPath);
  
  for(const dirPath of dirList) {
    await parseMovie(dirPath);
  }
}

asdf('/archive/Movies');