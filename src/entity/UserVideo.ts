import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, getConnection, FindConditions } from 'typeorm';

import { Video } from '@src/entity';
import { IUserVideo } from '@src/models';
import { timeAgo } from '@src/utils';

@Entity()
export class UserVideo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(type => Video)
  @JoinColumn()
  video: Video;

  @Column({ default: 0 })
  time: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  static async $findOne(where: FindConditions<UserVideo>): Promise<UserVideo | undefined> {
    return await getConnection()
      .getRepository(UserVideo)
      .findOne({
        where,
        relations: ['video'],
      });
  }

  static async $find(where: FindConditions<UserVideo>): Promise<UserVideo[]> {
    return await getConnection()
      .getRepository(UserVideo)
      .find({
        where,
        relations: ['video'],
      });
  }

  convert(): IUserVideo {
    return {
      userId: this.userId,
      video: this.video.convert(),
      time: this.time,
      date: timeAgo(this.date),
    };
  }
}
