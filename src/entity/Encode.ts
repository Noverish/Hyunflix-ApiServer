import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { IEncode } from '@src/models';
import { timeAgo } from '@src/utils';

@Entity()
export class Encode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  inpath: string;

  @Column()
  outpath: string;

  @Column()
  options: string;

  @Column('float', { default: 0 })
  progress: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  convert(): IEncode {
    return {
      id: this.id,
      inpath: this.inpath,
      outpath: this.outpath,
      options: this.options,
      progress: this.progress,
      date: timeAgo(this.date),
    };
  }
}
