export const FILE_SERVER = 'http://home.hyunsub.kim:8200';
export const ARCHIVE_PATH = '/archive';
export const AUTH_URL = process.env.AUTH_URL || 'http://asdfasdf';
export const PORT = parseInt(process.env.PORT, 10) || 80;
export const VIDEO_FOLDER_PATHS = ['/archive/Movies', '/archive/TV_Programs'];
export const FFMPEG_HOST = process.env.FFMPEG_URL || 'http://ffmpeg';

export const USER_VIDEO_SOCKET_PATH = '/socket.io/user/video';
export const VIDEO_EXAMINE_SOCKET_PATH = '/socket.io/videos/examine';
