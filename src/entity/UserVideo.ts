import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, getConnection, FindConditions } from 'typeorm';

import { VideoArticle } from '@src/entity';
import { timeAgo } from '@src/utils';
import { IUserVideo } from '@src/models';

@Entity()
export class UserVideo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(type => VideoArticle)
  @JoinColumn()
  article: VideoArticle;

  @Column({ default: 0 })
  time: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  static async $findOne(where: FindConditions<UserVideo>): Promise<UserVideo | null> {
    return await getConnection()
      .getRepository(UserVideo)
      .findOne({
        where,
        relations: ['article', 'article.videos'],
      });
  }

  static async $find(where: FindConditions<UserVideo>): Promise<UserVideo[]> {
    return await getConnection()
      .getRepository(UserVideo)
      .find({
        where,
        relations: ['article', 'article.videos'],
      });
  }

  convert(): IUserVideo {
    return {
      userId: this.userId,
      article: this.article.convert(),
      time: this.time,
      date: timeAgo(this.date),
    };
  }
}
