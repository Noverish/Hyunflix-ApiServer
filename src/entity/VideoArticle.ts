import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, getConnection } from 'typeorm';

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

  convert(): IVideoArticle {
    return {
      articleId: this.articleId,
      tags: this.tags.split(','),
      title: this.title,
      date: dateToString(this.date),
      videos: (this.videos || []).map(v => v.convert()),
    };
  }
}
