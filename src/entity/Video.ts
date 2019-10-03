import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, getConnection } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
  
  static async findByPath(path: string): Promise<Video | null> {
    return await getConnection()
      .getRepository(Video)
      .findOne({ where: { path } });
  }
  
  static async update(videoId: number, values: QueryDeepPartialEntity<Video>) {
    await getConnection()
      .createQueryBuilder()
      .update(Video)
      .set(values)
      .where('videoId = :videoId', { videoId })
      .execute();
  }
  
  static async insert(values: QueryDeepPartialEntity<Video>): Promise<number> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Video)
      .values(values)
      .execute();
    
    return result.identifiers[0].videoId;
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
