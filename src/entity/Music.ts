import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { IMusic } from '@src/models';
import { pathToURL } from '@src/utils';

@Entity()
export class Music extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @Column()
  duration: number;

  @Column({ default: '' })
  tags: string;

  @Column({ default: 0 })
  authority: number;

  @Column({ nullable: true })
  youtube: string | null;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  convert(): IMusic {
    return {
      id: this.id,
      title: this.title,
      path: this.path,
      url: pathToURL(this.path),
      duration: this.duration,
      youtube: this.youtube,
      tags: this.tags.split(',').filter(t => !!t),
    };
  }
}
