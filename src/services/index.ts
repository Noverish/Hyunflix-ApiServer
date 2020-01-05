import * as YoutubeService from './youtube';
import * as SSEService from './sse';
import * as RequestService from './request';
import * as VideoService from './video';
import * as UserVideoService from './user-video';
import * as MusicService from './music';
import * as MusicPlaylistService from './music-playlist';
import * as ComicService from './comic';

type ServiceResult = [number, object];

export {
  YoutubeService,
  SSEService,
  RequestService,
  ServiceResult,
  VideoService,
  UserVideoService,
  MusicService,
  MusicPlaylistService,
  ComicService,
};
