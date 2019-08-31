import * as fs from 'fs';
import { createConnection } from 'typeorm';
import { join, parse, extname, basename } from 'path';

import { walk } from '@src/fs';
import { Music } from '@src/entity';
import { ffprobeAudio, FFProbeAudio } from '@src/utils/ffprobe';

const fsPromises = fs.promises;

(async function() {
  const conn = await createConnection();
  const filePaths: string[] = await walk('/archive/Musics/가요');
  
  await Music.truncate();
  
  for(const filePath of filePaths) {
    const ext = extname(filePath);
    if(ext !== '.mp3') {
      continue;
    }
    
    const name = basename(filePath, ext);
    
    const duration = (await ffprobeAudio(filePath)).duration;
    await Music.insertOne(name, filePath, duration, '');
    console.log(name, duration);
  }
})().then(() => {
  console.log('done');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});