import { extname, basename } from 'path';

import { Video, VideoArticle } from '@src/entity';
import { walk, statBulk, ffprobeVideo } from '@src/api';
import { VIDEO_FOLDER_PATHS, VIDEO_EXAMINE_SOCKET_PATH } from '@src/config';
import { FFProbeVideo, Stat } from '@src/models';
import { send } from '@src/sockets';

type Callback = (msg: string) => void;
type Insert = string;
type Update = { id: number, path: string };
type Delete = Video;

export default function () {
  const callback: Callback = (msg: string) => {
    send(VIDEO_EXAMINE_SOCKET_PATH, msg);
  };

  (async function () {
    let videoPaths: string[] = [];

    for (const folderPath of VIDEO_FOLDER_PATHS) {
      const allFilePaths: string[] = await walk(folderPath);
      videoPaths = videoPaths.concat(allFilePaths.filter(f => extname(f) === '.mp4'));
    }

    await examineInsert(videoPaths, callback);
    await examineUpdate(videoPaths, callback);
    await examineDelete(videoPaths, callback);

    callback('Done!');
  })().catch(err => callback(err.stack));
}

async function examineInsert(videoPaths: string[], callback: Callback) {
  const videoStats: Stat[] = await statBulk(videoPaths);

  const insertQueue: Insert[] = [];

  for (const videoStat of videoStats) {
    const { path, size } = videoStat;
    const video: Video | null = await Video.findByPath(path);

    if (!video) {
      insertQueue.push(path);
    }
  }

  for (const path of insertQueue) {
    const ffprobe: FFProbeVideo = await ffprobeVideo(path);

    const videoId: number = await Video.insert({
      path,
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
      title: basename(path, extname(path)),
      date: new Date(),
    });

    const article: VideoArticle = await VideoArticle.findById(articleId);

    await Video.update(videoId, { article });

    callback(`[Inserted] ${path}`);
  }
}

async function examineUpdate(videoPaths: string[], callback: Callback) {
  const videoStats: Stat[] = await statBulk(videoPaths);

  const updateQueue: Update[] = [];

  for (const videoStat of videoStats) {
    const { path, size } = videoStat;
    const video: Video | null = await Video.findByPath(path);

    if (video && (size.toString() !== video.size.toString())) {
      updateQueue.push({ path , id: video.id });
    }
  }

  for (const { id, path } of updateQueue) {
    const ffprobe: FFProbeVideo = await ffprobeVideo(path);

    await Video.update(id, {
      duration: ffprobe.duration,
      width: ffprobe.width,
      height: ffprobe.height,
      bitrate: ffprobe.bitrate,
      size: ffprobe.size.toString(),
    });

    callback(`[Modified] ${path}`);
  }
}

async function examineDelete(videoPaths: string[], callback: Callback) {
  const videos: Video[] = await Video.findAll();

  const deleteQueue: Delete[] = [];

  for (const video of videos) {
    if (!videoPaths.includes(video.path)) {
      deleteQueue.push(video);
    }
  }

  for (const video of deleteQueue) {
    await Video.delete(video.id);
    callback(`[Deleted Video] ${video.path}`);
  }

  const videoArticles: VideoArticle[] = await VideoArticle.findAll();

  for (const videoArticle of videoArticles) {
    if (videoArticle.videos.length === 0) {
      await VideoArticle.delete(videoArticle.id);
      callback(`[Deleted VideoArticle] ${videoArticle.title}`);
    }
  }
}