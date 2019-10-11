import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, getConnection } from 'typeorm';

import { VideoArticle } from '@src/entity';
import { dateToString } from '@src/utils';
import { IUserVideo } from '@src/models';

@Entity()
export class UserVideo {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  userId: number;

  @OneToOne(type => VideoArticle)
  @JoinColumn()
  article: VideoArticle;
  
  @Column({ default: 0 })
  time: number;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  date: Date;
  
  static async find(userId: number, articleId: number): Promise<UserVideo | null> {
    return await getConnection()
      .getRepository(UserVideo)
      .findOne({
        where: { userId, articleArticleId: articleId },
        relations: ['article', 'article.videos'],
      });
  }
  
  static async findAll(userId: number): Promise<UserVideo[]> {
    return await getConnection()
      .getRepository(UserVideo)
      .find({
        where: { userId },
        relations: ['article', 'article.videos'],
      });
  }
  
  static async insert(userId: number, article: VideoArticle) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserVideo)
      .values({ userId, article })
      .execute();
  }
  
  static async update(userId: number, articleId: number, time: number) {
    await getConnection()
      .createQueryBuilder()
      .update(UserVideo)
      .set({ time, date: new Date() })
      .where({ userId, articleId })
      .execute();
  }
  
  convert(): IUserVideo {
    return {
      userId: this.userId,
      article: this.article.convert(),
      time: this.time,
      date: dateToString(this.date),
    }
  }
}
