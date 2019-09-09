import { Entity, PrimaryColumn, Column, getConnection, ViewColumn } from "typeorm";
import { relative } from 'path';

import { ARCHIVE_PATH } from '@src/config';
import { dateToString } from '@src/utils/date'

@Entity({ name: 'MovieDetail' })
export class MovieDetailEntity {
  @PrimaryColumn()
  videoId: number;

  @Column()
  title: string;

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
}

export class MovieDetail {
  videoId: number;
  title: string;
  path: string;
  duration: number;
  width: number;
  height: number;
  bitrate: number;
  size: number;
  date: string;
  resolution: string;
  
  constructor(e: MovieDetailEntity) {
    this.videoId = e.videoId;
    this.title = e.title;
    this.path = '/' + relative(ARCHIVE_PATH, e.path);
    this.duration = e.duration;
    this.width = e.width;
    this.height = e.height;
    this.bitrate = e.bitrate;
    this.size = e.size;
    this.date = dateToString(e.date);
    
    // TODO 좀더 멋있게
    if (e.width > 1900) {
      this.resolution = '1080p';
    } else if (e.width > 1200) {
      this.resolution = '720p';
    } else {
      this.resolution = '360p';
    }
  }
  
  static async findAll(): Promise<MovieDetail[]> {
    const list =  await getConnection()
      .getRepository(MovieDetailEntity)
      .createQueryBuilder()
      .getMany();
    return list.map(e => new MovieDetail(e));
  }
  
  static async findById(videoId: number): Promise<MovieDetail | null> {
    const e = await getConnection()
      .getRepository(MovieDetailEntity)
      .createQueryBuilder()
      .where('videoId = :videoId', { videoId })
      .getOne();
    return (e) ? new MovieDetail(e) : null;
  }
}