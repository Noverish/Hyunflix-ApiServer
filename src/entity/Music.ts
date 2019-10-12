import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { IMusic } from '@src/models';
import { pathToURL } from '@src/utils';

@Entity()
export class Music {
  @PrimaryGeneratedColumn()
  id: number;

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
      .find({
        order: { date: 'DESC' }
      });
  }
  
  static async insert(param: QueryDeepPartialEntity<Music>): Promise<number> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Music)
      .values(param)
      .execute();

    return result.identifiers[0].id;
  }

  convert(): IMusic {
    return {
      id: this.id,
      title: this.title,
      url: pathToURL(this.path),
      duration: this.duration,
      youtube: this.youtube,
      tags: this.tags.split(',').filter(t => !!t),
    };
  }
}
