import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

import { dateToString } from '@src/utils/date';

@Entity({ name: 'VideoArticle' })
export class VideoArticleEntity {
  @PrimaryGeneratedColumn({ name: 'article_id' })
  articleId: number;
  
  @Column({ name: 'video_id' })
  videoId: number;
  
  @Column()
  tags: string;

  @Column()
  title: string;
  
  @Column()
  date: Date;
}

export class VideoArticle {
  articleId: number;
  videoId: number;
  tags: string;
  title: string;
  date: string;
  
  constructor(e: VideoArticleEntity) {
    this.articleId = e.articleId;
    this.videoId = e.videoId;
    this.tags = e.tags;
    this.title = e.title;
    this.date = dateToString(e.date);
  }
  
  static async insert(videoId: number, tags: string, title: string, date: Date) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(VideoArticleEntity)
      .values({ videoId, tags, title, date })
      .execute();
  }
}