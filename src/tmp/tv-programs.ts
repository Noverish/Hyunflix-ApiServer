import { promises as fsPromises } from 'fs';
import { join, parse } from 'path';
import { createConnection } from 'typeorm';

import { Video, TVProgram } from '@src/entity';
import { fs as customFs } from '@src/utils';

async function parseMovie(dirPath) {
  const files = await fsPromises.readdir(dirPath);
  const filePaths = files.map((f) => join(dirPath, f)).sort();
  
  const folderName = parse(dirPath).base;
  
  let i = 1;
  for(const filePath of filePaths) {
    const parsed = parse(filePath);
    
    if(parsed.ext === '.mp4') {
      const video: Video | null = await Video.findByPath(filePath);
      
      if(video) {
        console.log(video.videoId, folderName, parsed.name, i);
        TVProgram.insert(video.videoId, folderName, parsed.name, i, new Date(), new Date());
        i++;
      } else {
        console.error(`[ERROR] No ${filePath}`);
      }
    }
  }
}

export async function asdf(movieFolderPath: string) {
  const dirList = await customFs.walkDir(movieFolderPath);
  
  for(const dirPath of dirList) {
    await parseMovie(dirPath);
  }
}

(async function() {
  await createConnection();
  await asdf('/archive/TV_Programs');
  process.exit(0);
})();