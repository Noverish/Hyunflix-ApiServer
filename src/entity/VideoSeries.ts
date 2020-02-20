import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, getConnection, FindConditions, FindManyOptions } from 'typeorm';

import { Video } from '@src/entity';
import { IVideoSeries } from '@src/models';

@Entity()
export class VideoSeries extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => Video, video => video.series)
  videos: Video[];

  @Column()
  title: string;

  @Column({ default: '' })
  category: string;

  @Column({ default: 1 })
  authority: number;

  static async $findOne(where?: FindConditions<VideoSeries>): Promise<VideoSeries | null> {
    return await getConnection()
      .getRepository(VideoSeries)
      .findOne({
        where,
        relations: ['videos'],
      });
  }

  static async $find(where?: FindConditions<VideoSeries>, options?: FindManyOptions<VideoSeries>): Promise<VideoSeries[]> {
    return await getConnection()
      .getRepository(VideoSeries)
      .find({
        where,
        relations: ['videos'],
        ...options,
      });
  }

  convert(): IVideoSeries {
    return {
      id: this.id,
      videos: (this.videos || []).map(a => a.convert()),
      title: this.title,
      category: this.category,
    };
  }
}
