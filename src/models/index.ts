export enum Type {
  folder = "folder",
  video = "video",
  image = "image",
  text = "text",
  etc = "etc"
}

export namespace Type {
  export function parse(ext: string): Type {
    ext = ext.toLowerCase();
    
    switch (ext) {
      case '':
       return Type.folder;
      case '.mp4':
        return Type.video;
      case '.vtt':
      case '.srt':
      case '.smi':
      case '.txt':
        return Type.text;
      case '.jpg':
      case '.jpeg':
      case '.png':
        return Type.image;
      default:
        return Type.etc;
    }
  }
}


export interface ServerResponse {
  type: Type,
  path: string
  name: string
  ext: string
  payload: File[] | Video | Image | Text
}

export interface File {
  name: string
  type: Type
  path: string
  isDir: boolean
  size: string | null
}

export interface Video {
  posterUrl: string | null
  videoUrl: string
  subtitleUrl: string | null
  videoWidth: number
  videoHeight: number
}

export interface Image {
  rawUrl: string
}

export interface Text {
  rawUrl: string
}