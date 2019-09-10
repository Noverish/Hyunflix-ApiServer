import { createConnection } from 'typeorm';
import { promises as fsPromises} from 'fs';
import { join, basename, dirname, extname } from 'path';

import { Video, VideoArticle } from '@src/entity'

async function main() {
  await createConnection();
  
  const videos: Video[] = await Video.findAll()
  
  videos.sort((a, b) => (a.path > b.path) ? 1 : -1);
  
  for(const video of videos) {
    const path = video.path;
    
    let category = '';
    let title = '';
    if (path.startsWith('/Movies')) {
      title = basename(dirname(path));
      category = 'movie';
    } else {
      title = basename(path, extname(path));
      category = 'drama';
    }
    
    const stat = await fsPromises.stat(join('/archive', path));
    console.log(title, stat.ctime);
    
    await VideoArticle.insert(video.videoId, category, title, stat.ctime);
  }
}

(async function() {
  await main();
  process.exit(0);
})();