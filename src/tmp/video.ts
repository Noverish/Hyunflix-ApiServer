import { createConnection } from 'typeorm';
import { extname } from 'path';

import { Video } from '@src/entity';
import { fs, ffprobe } from '@src/utils';

const paths = ['/archive/Movies', '/archive/TV_Programs'];

export async function start() {
  for(const path of paths) {
    await startFolder(path);
  }
}

async function startFolder(folderPath: String) {
  const paths = await fs.walk(folderPath);
  
  for(const path of paths) {
    const ext = extname(path);
    
    if(ext === '.mp4') {
      const already: Video | null = await Video.findByPath(path);
      
      if(already) {
        continue;
      }
      
      const probed: ffprobe.FFProbeVideo = await ffprobe.ffprobeVideo(path);
      
      const video = new Video();
      video.path = path;
      video.duration = probed.duration;
      video.width = probed.width;
      video.height = probed.height;
      video.bitrate = probed.bitrate;
      video.size = probed.size;
      
      Video.insert(video);
      
      console.log(`[DONE] ${path}`);
    }
  }
}

(async function() {
  await createConnection();
  await start();
  process.exit(0);
})();