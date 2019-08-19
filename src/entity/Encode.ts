import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

@Entity({ name: 'encode' })
export class Encode {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  target: string;

  @Column()
  progress: number;

  @Column()
  date: Date;

  static async findAll(): Promise<Encode[]> {
    return await getConnection()
      .getRepository(Encode)
      .createQueryBuilder()
      .orderBy("_id", "DESC")
      .getMany();
  }

  static async findNotDone(): Promise<Encode[]> {
    return await getConnection()
      .getRepository(Encode)
      .createQueryBuilder()
      .where('progress < 100')
      .getMany();
  }

  static async updateProgress(_id: number, progress: number) {
    return await getConnection()
      .createQueryBuilder()
      .update(Encode)
      .set({ progress })
      .where('_id = :_id', { _id })
      .execute();
  }

  static async insert(target: string) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Encode)
      .values({
        target,
        date: new Date(),
      })
      .execute();
  }
}
