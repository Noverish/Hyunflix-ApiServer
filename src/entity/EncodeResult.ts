import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { EncodeResultDTO } from '@src/models';

@Entity()
export class EncodeResult extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  duration: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  bitrate: number;

  @Column('bigint')
  size: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  convert(): EncodeResultDTO {
    return {
      ...this,
      size: parseInt(this.size),
      date: this.date.toISOString(),
    };
  }
}
