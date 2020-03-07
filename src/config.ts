export const FILE_SERVER = 'https://archive.hyunsub.kim';
export const PORT = parseInt(process.env.PORT, 10) || 80;
export const VIDEO_FOLDER_PATHS = ['/Movies', '/TV_Programs'];
export const MUSIC_FOLDER_PATH = '/Musics';

export const RPC_SERVER_HOST = 'home.hyunsub.kim';
export const RPC_SERVER_PORT = 8123;
export const SSE_SERVER = 'http://home.hyunsub.kim:8124';
export const TOKEN_HEADER = 'x-hyunsub-access-token';
export const TOKEN_KEY_PATH = 'keys/public.pem';
export const TOKEN_ALGORITHM = 'RS256';
export const TOKEN_PAYLOAD_FIELD = 'token-payload';
