import * as YoutubeService from './youtube';
import * as SSEService from './sse';
import * as VideoService from './video';
import * as UserVideoService from './user-video';
import * as MusicService from './music';
import * as MusicPlaylistService from './music-playlist';
import * as ComicService from './comic';
import * as TokenService from './token';
import * as EncodeService from './encode';

type ServiceResult = [number, object];

export {
  YoutubeService,
  SSEService,
  ServiceResult,
  VideoService,
  UserVideoService,
  MusicService,
  MusicPlaylistService,
  ComicService,
  TokenService,
  EncodeService,
};
