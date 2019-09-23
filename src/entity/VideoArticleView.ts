import { Entity, PrimaryColumn, Column, getConnection } from 'typeorm';

import { dateToString } from '@src/utils/date';

@Entity({ name: 'VideoArticleView' })
export class VideoArticleView {
  @PrimaryColumn({ name: 'article_id' })
  articleId: number;
  
  @Column({ name: 'video_id' })
  videoId: number;
  
  @Column()
  tags: string;

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
  size: string;
  
  static async findAll() {
    return await getConnection()
      .getRepository(VideoArticleView)
      .createQueryBuilder()
      .orderBy('article_id', 'DESC')
      .getMany();
  }
  
  static async findById(articleId: number): Promise<VideoArticleView | null> {
    return await getConnection()
      .getRepository(VideoArticleView)
      .createQueryBuilder()
      .where('article_id = :articleId', { articleId })
      .getOne();
  }
  
  static async findTags(): Promise<string[]> {
    const tmp = await getConnection()
      .getRepository(VideoArticleView)
      .createQueryBuilder()
      .select('tags')
      .groupBy('tags')
      .getRawMany();
    return tmp.map(t => t['tags']);
  }
}
