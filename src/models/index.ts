export interface IVideo {
  videoId: number;
  url: string;
  duration: number;
  width: number;
  height: number;
  bitrate: number;
  size: string;
}

export interface ISubtitle {
  language: string;
  url: string;
}

export interface IVideoArticle {
  articleId: number;
  videos: IVideo[];
  tags: string[];
  title: string;
  date: string;
}

export interface IMusic {
  musicId: number;
  title: string;
  url: string;
  duration: number;
  artist: string;
  tags: string[];
}

export interface File {
  url: string;
  path: string;
  name: string;
  isdir: boolean;
  size: string;
}
