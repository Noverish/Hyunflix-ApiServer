import { Movie } from '@src/entity';
import { createConnection } from 'typeorm';
import { promises } from 'fs';
import { extname, join, basename } from 'path';

(async function() {
  const conn = await createConnection();
  const movies: Movie[] = await Movie.get();
  
  for(const movie of movies) {
    const files = await promises.readdir(movie.path);
      
    const resolutions: string[] = []
    
    for(const file of files) {
      const path = join(movie.path, file);
      const ext = extname(file);
      
      if(ext === '.mp4') {
        const name = basename(file, ext);
        
        resolutions.push(name);
      }
    }
    
    await Movie.updateOne(movie.movie_id, { resolution: resolutions.join(',') })
  }
  
})();
