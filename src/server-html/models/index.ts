export interface File {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number | null;
  displayName: string;
  displaySize: string | null;
}

export interface Folder {
  path: string;
  files: File[];
}

export interface Video {
  name: string;
  posterUrl: string;
  videoUrl: string;
  subtitleUrl: string;
  videoWidth: number;
  videoHeight: number;
}
