import { extname, basename, dirname } from 'path';
import { getConnection, createConnection } from 'typeorm';
import { promises as fsPromises } from 'fs';

import { Video, VideoArticle } from '@src/entity';
import { walk } from '@src/fs';
import { ARCHIVE_PATH, VIDEO_FOLDER_PATHS } from '@src/config';
import { ffprobeVideo } from '@src/api';
import { FFProbeVideo } from '@src/models';

async function main() {
  try {
    await getConnection();
  } catch (err) {
    await createConnection();
  }
  
  for (const folderPath of VIDEO_FOLDER_PATHS) {
    await examineFolder(folderPath);
  }
}

async function examineFolder(folderPath: string) {
  const videoPaths: string[] = (await walk(folderPath)).filter(f => extname(f) === '.mp4');
  
  for (const videoPath of videoPaths) {
    await examineVideo(videoPath)
  }
}

async function examineVideo(videoPath: string) {
  const relativeVideoPath = videoPath.replace(ARCHIVE_PATH, '');
  const video: Video | null = await Video.findByPath(relativeVideoPath);
  
  if (video) {
    const stat = await fsPromises.stat(videoPath);
    
    if (stat.size.toString() !== video.size.toString()) {
      console.log('[Modified]', videoPath);
      process.exit(0);
    }
  } else {
    const ffprobe: FFProbeVideo = await ffprobeVideo(relativeVideoPath);
    
    const videoId: number = await Video.insert({
      path: relativeVideoPath,
      duration: ffprobe.duration,
      width: ffprobe.width,
      height: ffprobe.height,
      bitrate: ffprobe.bitrate,
      size: ffprobe.size.toString(),
    })
    
    const video: Video = await Video.findById(videoId);
    
    const articleId: number = await VideoArticle.insert({
      videos: [video],
      tags: '',
      title: basename(videoPath, extname(videoPath)),
      date: new Date()
    })
    
    const article: VideoArticle = await VideoArticle.findById(articleId);
    
    await Video.update(videoId, { article })
    
    console.log('[Inserted]', videoPath);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })