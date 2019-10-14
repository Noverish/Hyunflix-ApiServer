export interface IVideo {
  id: number;
  url: string;
  duration: number;
  width: number;
  height: number;
  bitrate: number;
  size: number;
  durationString: string;
  bitrateString: string;
  sizeString: string;
  resolution: string;
}

export interface ISubtitle {
  language: string;
  url: string;
}

export interface RawSubtitle {
  language: string;
  path: string;
}

export interface IVideoArticle {
  id: number;
  videos: IVideo[];
  tags: string[];
  title: string;
  date: string;
}

export interface IVideoBundle {
  id: number;
  articles: IVideoArticle[];
  title: string;
  category: string;
}

export interface IMusic {
  id: number;
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

export interface FFProbe {
  duration: number;
}

export interface FFProbeVideo extends FFProbe {
  width: number;
  height: number;
  bitrate: number;
  size: number;
}

export interface UserVideoTime {
  userId: number;
  articleId: number;
  time: number;
}

export interface IUserVideo {
  userId: number;
  article: IVideoArticle;
  time: number;
  date: string;
}
