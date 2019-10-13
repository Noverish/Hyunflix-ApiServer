import { extname, basename, dirname, join } from 'path';
import { promises as fsPromises } from 'fs';

import { Video, VideoArticle } from '@src/entity';
import { walk } from '@src/fs';
import { ARCHIVE_PATH, VIDEO_FOLDER_PATHS, VIDEO_EXAMINE_SOCKET_PATH } from '@src/config';
import { ffprobeVideo } from '@src/api';
import { FFProbeVideo } from '@src/models';
import { send } from '@src/sockets';

export default function() {
  const callback = (msg: string) => {
    send(VIDEO_EXAMINE_SOCKET_PATH, msg);
  }
  
  (async function() {
    for (const folderPath of VIDEO_FOLDER_PATHS) {
      await examineFolder(folderPath, callback);
    }
    await examineDeleted(callback);
    
    callback('Done!');
  })().catch((err) => callback(err.stack));
}

async function examineFolder(folderPath: string, callback: (msg: string) => void) {
  const videoPaths: string[] = (await walk(folderPath)).filter(f => extname(f) === '.mp4');

  for (const videoPath of videoPaths) {
    await examineVideo(videoPath, callback);
  }
}

async function examineVideo(videoPath: string, callback: (msg: string) => void) {
  const relativeVideoPath = videoPath.replace(ARCHIVE_PATH, '');
  const video: Video | null = await Video.findByPath(relativeVideoPath);

  if (video) {
    const stat = await fsPromises.stat(videoPath);

    if (stat.size.toString() !== video.size.toString()) {
      const ffprobe: FFProbeVideo = await ffprobeVideo(relativeVideoPath);

      await Video.update(video.id, {
        duration: ffprobe.duration,
        width: ffprobe.width,
        height: ffprobe.height,
        bitrate: ffprobe.bitrate,
        size: ffprobe.size.toString(),
      });

      callback('[Modified] ' + videoPath);
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
    });

    const video: Video = await Video.findById(videoId);

    const articleId: number = await VideoArticle.insert({
      videos: [video],
      tags: '',
      title: basename(videoPath, extname(videoPath)),
      date: new Date(),
    });

    const article: VideoArticle = await VideoArticle.findById(articleId);

    await Video.update(videoId, { article });

    callback('[Inserted] ' + videoPath);
  }
}

async function examineDeleted(callback: (msg: string) => void) {
  const videos: Video[] = await Video.findAll();
  
  for (const video of videos) {
    const realVideoPath = join(ARCHIVE_PATH, video.path);
    try {
      await fsPromises.access(realVideoPath);
    } catch (err) {
      await Video.delete(video.id);
      callback('[Deleted Video] ' + video.path);
    }
  }
  
  const videoArticles: VideoArticle[] = await VideoArticle.findAll();
  
  for (const videoArticle of videoArticles) {
    if (videoArticle.videos.length === 0) {
      await VideoArticle.delete(videoArticle.id);
      callback('[Deleted VideoArticle] ' + videoArticle.title);
    }
  }
}