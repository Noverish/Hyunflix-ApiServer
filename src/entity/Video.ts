import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, getConnection } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { VideoArticle } from '@src/entity';
import { IVideo } from '@src/models';
import { pathToURL } from '@src/utils';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

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
  
  static async findAll(): Promise<Video[]> {
    return await getConnection()
      .getRepository(Video)
      .find();
  }

  static async findById(id: number): Promise<Video | null> {
    return await getConnection()
      .getRepository(Video)
      .findOne({ where: { id } });
  }

  static async findByPath(path: string): Promise<Video | null> {
    return await getConnection()
      .getRepository(Video)
      .findOne({ where: { path } });
  }

  static async update(id: number, values: QueryDeepPartialEntity<Video>) {
    await getConnection()
      .createQueryBuilder()
      .update(Video)
      .set(values)
      .where('id = :id', { id })
      .execute();
  }

  static async insert(values: QueryDeepPartialEntity<Video>): Promise<number> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Video)
      .values(values)
      .execute();

    return result.identifiers[0].id;
  }
  
  static async delete(id: number) {
    await getConnection()
      .getRepository(Video)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  convert(): IVideo {
    return {
      id: this.id,
      url: pathToURL(this.path),
      duration: this.duration,
      width: this.width,
      height: this.height,
      bitrate: this.bitrate,
      size: this.size,
    };
  }
}
