import { promises as fsPromises } from 'fs';
import { dirname, join, basename } from 'path';
import { walk } from '@src/utils/fs';

(async function() {
  const ROOT = '/archive/Musics/가요';
  
  const filePaths = await walk(ROOT);
  
  for (const filePath of filePaths) {
    const parent = basename(dirname(filePath));
    if(parent !== '가요') {
      continue;
    }
    
    const name = basename(filePath);
    
    const artist = name.split(' - ')[0];
    const artistFolderPath = join('/archive/Musics/가요', artist);
    
    try {
      await fsPromises.access(artistFolderPath);
    } catch (err) {
      console.log('mkdir', artistFolderPath);
      await fsPromises.mkdir(artistFolderPath);
    }
    
    console.log('rename', filePath, join(dirname(filePath), artist, name));
    await fsPromises.rename(filePath, join(dirname(filePath), artist, name));
    
    // console.log(artist, name);
  }
})();
