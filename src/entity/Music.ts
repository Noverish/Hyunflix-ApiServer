import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

import { IMusic } from '@src/models';
import { pathToURL } from '@src/utils';

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

  convert(): IMusic {
    return {
      musicId: this.musicId,
      title: this.title,
      url: pathToURL(this.path),
      duration: this.duration,
      artist: this.artist,
      tags: this.tags.split(','),
    };
  }
}
