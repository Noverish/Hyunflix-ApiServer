export const FILE_SERVER = 'http://home.hyunsub.kim:8200';
export const ARCHIVE_PATH = '/archive';
export const PORT = parseInt(process.env.PORT, 10) || 80;
export const VIDEO_FOLDER_PATHS = ['/Movies', '/TV_Programs'];
export const MUSIC_FOLDER_PATH = '/Musics';
export const FFMPEG_HOST = 'http://home.hyunsub.kim:8080/fs';

export const USER_VIDEO_SOCKET_PATH = '/api/socket.io/user/video';
export const VIDEO_EXAMINE_SOCKET_PATH = '/api/socket.io/videos/examine';
export const MUSIC_EXAMINE_SOCKET_PATH = '/api/socket.io/musics/examine';

export const API_SERVER_KEY = process.env.API_SERVER_KEY!;
