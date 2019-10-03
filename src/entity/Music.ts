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
  tags: string;

  @Column()
  authority: string;

  @Column({ nullable: true })
  youtube: string | null;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  static async findAll(): Promise<Music[]> {
    return await getConnection()
      .getRepository(Music)
      .createQueryBuilder()
      .orderBy('date', 'DESC')
      .getMany();
  }

  static async insert(title: string, path: string, duration: number, youtube: string | null, tags: string[], authority: string[]): Promise<number> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Music)
      .values({ title, path, duration, youtube, tags: tags.join(','), authority: authority.join(',') })
      .execute();

    return result.identifiers[0].musicId;
  }

  convert(): IMusic {
    return {
      musicId: this.musicId,
      title: this.title,
      url: pathToURL(this.path),
      duration: this.duration,
      youtube: this.youtube,
      tags: this.tags.split(',').filter(t => !!t),
    };
  }
}
