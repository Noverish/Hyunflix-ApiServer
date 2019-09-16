import { createConnection } from 'typeorm';
import { extname, basename } from 'path';

import * as fs from '@src/utils/fs';
import { Music } from '@src/entity';
import { ffprobeAudio } from '@src/utils/ffprobe';

(async function() {
  const conn = await createConnection();
  const filePaths: string[] = await fs.walk('/archive/Musics/가요');
  
  await Music.truncate();
  
  for(const filePath of filePaths) {
    const ext = extname(filePath);
    if(ext !== '.mp3') {
      continue;
    }
    
    const name = basename(filePath, ext);
    
    const duration = (await ffprobeAudio(filePath)).duration;
    await Music.insertOne(name, filePath.replace('/archive', ''), duration, '');
    console.log(name, duration);
  }
})().then(() => {
  console.log('done');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});