import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, getConnection } from 'typeorm';
import { relative } from 'path';

import { VideoArticle } from '@src/entity';
import { IVideo } from '@src/models';
import { ARCHIVE_PATH, FILE_SERVER } from '@src/config';

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

  @Column("bigint")
  size: string;
  
  @ManyToOne(type => VideoArticle, article => article.videos)
  article: VideoArticle;
  
  static async findAll(): Promise<Video[]> {
    return await getConnection()
      .getRepository(Video)
      .createQueryBuilder()
      .getMany();
  }
  
  static async findByPath(path: string): Promise<Video | null> {
    return await getConnection()
      .getRepository(Video)
      .createQueryBuilder()
      .where('path = :path', { path })
      .getOne();
  }
  
  static async findById(videoId: number): Promise<Video | null> {
    return await getConnection()
      .getRepository(Video)
      .createQueryBuilder()
      .where('videoId = :videoId', { videoId })
      .getOne();
  }
  
  async convert(): Promise<IVideo> {
    return {
      videoId: this.videoId,
      url: FILE_SERVER + '/' + relative(ARCHIVE_PATH, this.path),
      duration: this.duration,
      width: this.width,
      height: this.height,
      bitrate: this.bitrate,
      size: this.size,
    }
  }
}