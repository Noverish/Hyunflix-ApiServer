import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

import { dateToString } from '@src/utils/date';

@Entity({ name: 'encode' })
export class EncodeEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  inpath: string;

  @Column()
  outpath: string;
  
  @Column()
  options: string;

  @Column()
  progress: number;

  @Column()
  date: Date;
}

export class Encode {
  encodeId: number;
  inpath: string;
  outpath: string;
  options: string;
  progress: number;
  date: string;
  
  constructor(e: EncodeEntity) {
    this.encodeId = e._id;
    this.inpath = e.inpath;
    this.outpath = e.outpath;
    this.options = e.options;
    this.progress = e.progress;
    this.date = dateToString(e.date);
  }

  static async findAll(): Promise<Encode[]> {
    const entities = await getConnection()
      .getRepository(EncodeEntity)
      .createQueryBuilder()
      .orderBy("_id", "DESC")
      .getMany();
    return entities.map(e => new Encode(e));
  }

  static async findNotDone(): Promise<Encode[]> {
    const entities = await getConnection()
      .getRepository(EncodeEntity)
      .createQueryBuilder()
      .where('progress < 100')
      .getMany();
    return entities.map(e => new Encode(e));
  }

  static async updateProgress(_id: number, progress: number) {
    return await getConnection()
      .createQueryBuilder()
      .update(EncodeEntity)
      .set({ progress })
      .where('_id = :_id', { _id })
      .execute();
  }

  static async insert(inpath: string, outpath: string, options: string) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(EncodeEntity)
      .values({ inpath, outpath, options, date: new Date() })
      .execute();
  }
}
