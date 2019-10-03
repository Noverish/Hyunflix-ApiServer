import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, getConnection } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Video, VideoBundle } from '@src/entity';
import { IVideoArticle } from '@src/models';
import { dateToString } from '@src/utils';

@Entity()
export class VideoArticle {
  @PrimaryGeneratedColumn()
  articleId: number;

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
      .createQueryBuilder()
      .leftJoinAndSelect('VideoArticle.videos', 'video')
      .orderBy('articleId', 'DESC')
      .getMany();
  }

  static async findById(articleId: number): Promise<VideoArticle | null> {
    return await getConnection()
      .getRepository(VideoArticle)
      .createQueryBuilder()
      .leftJoinAndSelect('VideoArticle.videos', 'video')
      .where('articleId = :articleId', { articleId })
      .getOne();
  }

  static async update(articleId: number, params: Partial<VideoArticle>) {
    await getConnection()
      .createQueryBuilder()
      .update(VideoArticle)
      .set(params)
      .where('articleId = :articleId', { articleId })
      .execute();
  }
  
  static async insert(param: QueryDeepPartialEntity<VideoArticle>): Promise<number> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(VideoArticle)
      .values(param)
      .execute();
      
    return result.identifiers[0].articleId;
  }

  convert(): IVideoArticle {
    return {
      articleId: this.articleId,
      tags: this.tags.split(',').filter(t => !!t),
      title: this.title,
      date: dateToString(this.date),
      videos: (this.videos || []).map(v => v.convert()),
    };
  }
}
