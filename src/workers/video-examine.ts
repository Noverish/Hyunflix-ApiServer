import { extname, basename } from 'path';

import { Video, VideoArticle } from '@src/entity';
import { walk, access, lstat, ffprobeVideo } from '@src/api';
import { VIDEO_FOLDER_PATHS, VIDEO_EXAMINE_SOCKET_PATH } from '@src/config';
import { FFProbeVideo, Stat } from '@src/models';
import { send } from '@src/sockets';

export default function () {
  const callback = (msg: string) => {
    send(VIDEO_EXAMINE_SOCKET_PATH, msg);
  };

  (async function () {
    for (const folderPath of VIDEO_FOLDER_PATHS) {
      await examineFolder(folderPath, callback);
    }
    await examineDeleted(callback);

    callback('Done!');
  })().catch(err => callback(err.stack));
}

async function examineFolder(folderPath: string, callback: (msg: string) => void) {
  const videoPaths: string[] = (await walk(folderPath)).filter(f => extname(f) === '.mp4');

  for (const videoPath of videoPaths) {
    try {
      await examineVideo(videoPath, callback);
    } catch (err) {
      callback(videoPath);
      callback(err.stack);
    }
  }
}

async function examineVideo(videoPath: string, callback: (msg: string) => void) {
  const video: Video | null = await Video.findByPath(videoPath);

  if (video) {
    const stat: Stat = await lstat(videoPath);

    if (stat.size.toString() !== video.size.toString()) {
      const ffprobe: FFProbeVideo = await ffprobeVideo(videoPath);

      await Video.update(video.id, {
        duration: ffprobe.duration,
        width: ffprobe.width,
        height: ffprobe.height,
        bitrate: ffprobe.bitrate,
        size: ffprobe.size.toString(),
      });

      callback(`[Modified] ${videoPath}`);
    }
  } else {
    const ffprobe: FFProbeVideo = await ffprobeVideo(videoPath);

    const videoId: number = await Video.insert({
      path: videoPath,
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

    callback(`[Inserted] ${videoPath}`);
  }
}

async function examineDeleted(callback: (msg: string) => void) {
  const videos: Video[] = await Video.findAll();

  for (const video of videos) {
    const { error } = await access(video.path);

    if (error) {
      await Video.delete(video.id);
      callback(`[Deleted Video] ${video.path}`);
    }
  }

  const videoArticles: VideoArticle[] = await VideoArticle.findAll();

  for (const videoArticle of videoArticles) {
    if (videoArticle.videos.length === 0) {
      await VideoArticle.delete(videoArticle.id);
      callback(`[Deleted VideoArticle] ${videoArticle.title}`);
    }
  }
}
