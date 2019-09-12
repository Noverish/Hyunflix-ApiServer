import { Entity, PrimaryColumn, Column, getConnection } from 'typeorm';

import { dateToString } from '@src/utils/date';

@Entity({ name: 'VideoArticleView' })
export class VideoArticleView {
  @PrimaryColumn({ name: 'article_id' })
  articleId: number;
  
  @Column({ name: 'video_id' })
  videoId: number;
  
  @Column()
  category: string;

  @Column()
  title: string;
  
  @Column()
  date: Date;

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

  @Column()
  size: number;
  
  static async findAll() {
    return await getConnection()
      .getRepository(VideoArticleView)
      .createQueryBuilder()
      .getMany();
  }
  
  static async findById(articleId: number): Promise<VideoArticleView | null> {
    return await getConnection()
      .getRepository(VideoArticleView)
      .createQueryBuilder()
      .where('article_id = :articleId', { articleId })
      .getOne();
  }
}
