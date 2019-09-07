import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';
import { dateToString } from '@src/utils/date';

@Entity({ name: 'videos' })
export class Video {
  @PrimaryGeneratedColumn({ name: 'video_id' })
  videoId: number;

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

  @Column()
  date: Date;
  
  static async insert(video: Video): Promise<void> {
    await getConnection()
      .getRepository(Video)
      .save(video);
  }
}