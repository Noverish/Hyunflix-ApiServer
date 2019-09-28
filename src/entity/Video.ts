import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, getConnection } from 'typeorm';

import { VideoArticle } from '@src/entity';
import { IVideo } from '@src/models';
import { pathToURL } from '@src/utils';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  videoId: number;

  @Column()
  path: string;

  @Column()
  duration: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  bitrate: number;

  @Column('bigint')
  size: string;

  @ManyToOne(type => VideoArticle, article => article.videos)
  article: VideoArticle;

  static async findById(videoId: number): Promise<Video | null> {
    return await getConnection()
      .getRepository(Video)
      .createQueryBuilder()
      .where('videoId = :videoId', { videoId })
      .getOne();
  }

  convert(): IVideo {
    return {
      videoId: this.videoId,
      url: pathToURL(this.path),
      duration: this.duration,
      width: this.width,
      height: this.height,
      bitrate: this.bitrate,
      size: this.size,
    };
  }
}
