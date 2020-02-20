import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { IComic } from '@src/models';
import { timeAgo } from '@src/utils';

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

  @Column({ default: '' })
  tags: string;

  @Column({ default: 1 })
  authority: number;

  convert(): IComic {
    return {
      id: this.id,
      title: this.title,
      path: this.path,
      date: timeAgo(this.date),
      tags: this.tags.split(',').filter(t => !!t),
    };
  }
}
