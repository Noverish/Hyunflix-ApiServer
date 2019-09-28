import { Entity, PrimaryGeneratedColumn, Column, OneToMany, getConnection } from 'typeorm';

import { Video } from '@src/entity';
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

  convert(): IVideoArticle {
    return {
      articleId: this.articleId,
      tags: this.tags.split(','),
      title: this.title,
      date: dateToString(this.date),
      videos: this.videos.map(v => v.convert()),
    };
  }
}
