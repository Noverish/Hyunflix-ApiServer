import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

import { FILE_SERVER } from '@src/config';

@Entity({ name: 'Music' })
export class MusicEntity {
  @PrimaryGeneratedColumn({ name: 'music_id' })
  musicId: number;

  @Column()
  title: string;

  @Column()
  path: string;
  
  @Column()
  duration: number;

  @Column()
  artist: string;
}

export class Music {
  musicId: number;
  title: string;
  path: string;
  duration: number;
  artist: string;
  url: string;
  
  constructor(e: MusicEntity) {
    this.musicId = e.musicId;
    this.title = e.title;
    this.path = e.path;
    this.duration = e.duration;
    this.artist = e.artist;
    this.url = FILE_SERVER + e.path;
  }
  
  static async truncate() {
    return await getConnection()
      .getRepository(MusicEntity)
      .query('TRUNCATE Music');
  }
  
  static async insertOne(title: string, path: string, duration: number, artist: string) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(MusicEntity)
      .values({ title, path, duration, artist })
      .execute();
  }
  
  static async findAll(): Promise<Music[]> {
    const entities = await getConnection()
      .getRepository(MusicEntity)
      .createQueryBuilder()
      .getMany();
    return entities.map(e => new Music(e));
  }
}