import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { EncodeDTO } from '@src/models';
import { EncodeResult } from './EncodeResult';

@Entity({ name: 'encode2' })
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

  @OneToOne(type => EncodeResult, { nullable: true })
  @JoinColumn()
  before?: EncodeResult;

  @OneToOne(type => EncodeResult, { nullable: true })
  @JoinColumn()
  after?: EncodeResult;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  convert(): EncodeDTO {
    return {
      ...this,
      before: this.before?.convert() || null,
      after: this.after?.convert() || null,
      date: this.date.toISOString(),
    };
  }
}
