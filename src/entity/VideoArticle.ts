import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, getConnection } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Video, VideoBundle } from '@src/entity';
import { IVideoArticle } from '@src/models';
import { timeAgo } from '@src/utils';

@Entity()
export class VideoArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Video, video => video.article)
  videos: Video[];

  @Column()
  tags: string;

  @Column()
  title: string;

  @Column()
  date: Date;

  @ManyToOne(type => VideoBundle, bundle => bundle.articles)
  bundle: VideoBundle;

  static async findAll(): Promise<VideoArticle[]> {
    return await getConnection()
      .getRepository(VideoArticle)
      .find({
        relations: ['videos'],
        order: { id: 'DESC' },
      });
  }

  static async findById(id: number): Promise<VideoArticle | null> {
    return await getConnection()
      .getRepository(VideoArticle)
      .findOne({
        relations: ['videos'],
        where: { id },
      });
  }

  static async update(id: number, params: Partial<VideoArticle>) {
    await getConnection()
      .createQueryBuilder()
      .update(VideoArticle)
      .set(params)
      .where('id = :id', { id })
      .execute();
  }
  
  static async insert(param: QueryDeepPartialEntity<VideoArticle>): Promise<number> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(VideoArticle)
      .values(param)
      .execute();
      
    return result.identifiers[0].id;
  }

  convert(): IVideoArticle {
    return {
      id: this.id,
      tags: this.tags.split(',').filter(t => !!t),
      title: this.title,
      date: timeAgo.format(this.date),
      videos: (this.videos || []).map(v => v.convert()),
    };
  }
}
