import * as fs from 'fs';
import { join, parse } from 'path';

import { ffprobeVideo, FFProbeVideo } from '@src/utils/ffprobe';
import { walkDir } from '@src/fs';
const fsPromises = fs.promises;

async function parseMovie(dirPath) {
  const files = fs.readdirSync(dirPath);
  const filePaths = files.map((f) => join(dirPath, f));
  
  const movieName = parse(dirPath).name;
  
  for(const filePath of filePaths) {
    const parsed = parse(filePath);
    
    if(parsed.ext === '.mp4') {
      const probed: FFProbeVideo = await ffprobeVideo(filePath);
      console.log(movieName, probed.duration);
    }
  }
}

export async function asdf(movieFolderPath: string) {
  const dirList = await walkDir(movieFolderPath);
  
  for(const dirPath of dirList) {
    await parseMovie(dirPath);
  }
}

asdf('/archive/Movies');