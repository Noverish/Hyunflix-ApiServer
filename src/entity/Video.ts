import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import * as prettyBytes from 'pretty-bytes';

import { VideoSeries } from '@src/entity';
import { IVideo } from '@src/models';
import { pathToURL, second2String, width2Resolution, timeAgo } from '@src/utils';

@Entity()
export class Video extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column('bigint')
  size: string;

  @Column({ default: '' })
  tags: string;

  @Column({ default: 1 })
  authority: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(type => VideoSeries, bundle => bundle.videos)
  series: VideoSeries;

  convert(): IVideo {
    return {
      id: this.id,
      title: this.title,
      url: pathToURL(this.path),
      path: this.path,
      tags: this.tags.split(',').filter(t => !!t),
      date: timeAgo(this.date),

      duration: this.duration,
      width: this.width,
      height: this.height,
      bitrate: this.bitrate,
      size: parseInt(this.size, 10),

      durationString: second2String(this.duration),
      bitrateString: `${prettyBytes(this.bitrate, { bits: true })}/s`,
      sizeString: prettyBytes(parseInt(this.size, 10)),
      resolution: width2Resolution(this.width),
    };
  }
}
