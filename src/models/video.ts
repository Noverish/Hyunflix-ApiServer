export interface IVideo {
  id: number;
  title: string;
  url: string;
  path: string;
  tags: string[];
  date: string;

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

export interface IVideoSeries {
  id: number;
  videos: IVideo[];
  title: string;
  category: string;
}

export interface IUserVideo {
  video: IVideo;
  time: number;
  date: string;
}

export interface UserVideoTime {
  sessionId: string;
  videoId: number;
  time: number;
}
