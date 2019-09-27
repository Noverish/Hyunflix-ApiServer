import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';
import { relative } from 'path';

import { IMusic } from '@src/models';
import { ARCHIVE_PATH, FILE_SERVER } from '@src/config';

@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  musicId: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @Column()
  duration: number;

  @Column()
  artist: string;

  @Column()
  tags: string;

  @Column()
  authority: string;

  static async findAll(): Promise<Music[]> {
    return await getConnection()
      .getRepository(Music)
      .createQueryBuilder()
      .getMany();
  }

  static async findTags(): Promise<string[]> {
    const tmp = await getConnection()
      .getRepository(Music)
      .createQueryBuilder()
      .select('tags')
      .groupBy('tags')
      .getRawMany();
    return tmp.map(t => t['tags']);
  }

  convert(): IMusic {
    return {
      musicId: this.musicId,
      title: this.title,
      url: FILE_SERVER + '/' + relative(ARCHIVE_PATH, this.path),
      duration: this.duration,
      artist: this.artist,
      tags: this.tags.split(','),
    };
  }
}
