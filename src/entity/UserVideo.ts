import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, getConnection, FindConditions, FindManyOptions } from 'typeorm';

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

  static $findOne(where: FindConditions<UserVideo>): Promise<UserVideo | undefined> {
    return getConnection()
      .getRepository(UserVideo)
      .findOne({
        where,
        relations: ['video'],
      });
  }

  static $find(where?: FindConditions<UserVideo>, options?: FindManyOptions<UserVideo>): Promise<UserVideo[]> {
    return getConnection()
      .getRepository(UserVideo)
      .find({
        where,
        relations: ['video'],
        ...options,
      });
  }

  convert(): IUserVideo {
    return {
      video: this.video.convert(),
      time: this.time,
      date: timeAgo(this.date),
    };
  }
}
