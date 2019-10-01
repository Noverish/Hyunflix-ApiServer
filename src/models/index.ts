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

export interface IVideoBundle {
  bundleId: number;
  articles: IVideoArticle[];
  title: string;
  category: string;
}

export interface IMusic {
  musicId: number;
  title: string;
  url: string;
  duration: number;
  youtube: string | null;
  tags: string[];
}

export interface File {
  url: string;
  path: string;
  name: string;
  isdir: boolean;
  size: string;
}
