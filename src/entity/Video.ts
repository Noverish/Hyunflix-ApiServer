import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

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
  
  static async insert(video: Video): Promise<void> {
    await getConnection()
      .getRepository(Video)
      .save(video);
  }
  
  static async findByPath(path: string): Promise<Video | null> {
    return await getConnection()
      .getRepository(Video)
      .createQueryBuilder()
      .where('path = :path', { path })
      .getOne();
  }
  
  static async findById(videoId: number): Promise<Video | null> {
    return await getConnection()
      .getRepository(Video)
      .createQueryBuilder()
      .where('video_id = :videoId', { videoId })
      .getOne();
  }
}