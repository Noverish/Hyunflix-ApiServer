import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { IComic } from '@src/models';
import { dateToString } from '@src/utils';

@Entity()
export class Comic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  convert(): IComic {
    return {
      id: this.id,
      title: this.title,
      path: this.path,
      date: dateToString(this.date),
    };
  }
}
