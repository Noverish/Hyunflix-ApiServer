import * as YoutubeService from './youtube';
import * as SSEService from './sse';
import * as RequestService from './request';
import * as UserVideoService from './user-video';
import * as MusicPlaylistService from './music-playlist';

type ServiceResult = [number, object];

export {
  YoutubeService,
  SSEService,
  RequestService,
  ServiceResult,
  UserVideoService,
  MusicPlaylistService,
};
