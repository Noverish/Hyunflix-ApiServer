import * as fs from 'fs';
import { parse, join } from 'path';
import { Movie } from 'src/entity';
import { MovieDetail, Subtitle, Video } from 'src/models';

const SERVER = process.env.FILE_SERVER;

export function movieDetail(movie: Movie): MovieDetail {
  const files = fs.readdirSync(`/archive/Movies/${movie.path}`);
  const movieDetail: MovieDetail = {
    title: movie.title,
    path: movie.path,
    subtitles: [],
    videos: [],
    poster: null,
    thumbnail: null,
    date: movie.date.toISOString(),
  }
  
  for(const file of files) {
    const { base, name, ext } = parse(file);
    
    if(name === 'poster') {
      movieDetail.poster = 'http://' + join(SERVER, '/archive/Movies', movie.path, base);
    }
    
    if(name === 'thumbnail') {
      movieDetail.thumbnail = 'http://' + join(SERVER, '/archive/Movies', movie.path, base);
    }
    
    if(ext === '.smi' || ext === '.srt') {
      movieDetail.subtitles.push({
        language: name,
        src: 'http://' + join(SERVER, '/archive/Movies', movie.path, `${name}.vtt`),
      });
    }
    
    if(ext === '.mp4') {
      movieDetail.videos.push({
        resolution: parseInt(name),
        src: 'http://' + join(SERVER, '/archive/Movies', movie.path, base),
      })
    }
  }
  
  return movieDetail;
}