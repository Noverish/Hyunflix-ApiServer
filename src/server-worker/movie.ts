import { promises as fsPromises } from 'fs';
import { join, parse } from 'path';
import { createConnection } from 'typeorm';

import { Video, Movie } from '@src/entity';
import { fs as customFs } from '@src/utils';

async function parseMovie(dirPath) {
  const files = await fsPromises.readdir(dirPath);
  const filePaths = files.map((f) => join(dirPath, f));
  
  const movieName = parse(dirPath).name;
  
  for(const filePath of filePaths) {
    const parsed = parse(filePath);
    
    if(parsed.ext === '.mp4') {
      const video: Video | null = await Video.findByPath(filePath);
      
      if(video) {
        Movie.insert(video.videoId, movieName, new Date());
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
  await asdf('/archive/Movies');;
  process.exit(0);
})();