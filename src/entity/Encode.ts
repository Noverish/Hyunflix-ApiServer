import { Entity, PrimaryGeneratedColumn, Column, createConnection } from 'typeorm';

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
    const conn = await createConnection();
    const encodes = await conn
      .getRepository(Encode)
      .createQueryBuilder()
      .orderBy("_id", "DESC")
      .getMany();
    await conn.close();
    return encodes;
  }

  static async findNotDone(): Promise<Encode[]> {
    const conn = await createConnection();
    const encodes = await conn
      .getRepository(Encode)
      .createQueryBuilder()
      .where('progress < 100')
      .getMany();
    await conn.close();
    return encodes;
  }

  static async updateProgress(_id: number, progress: number) {
    const conn = await createConnection();
    await conn
      .createQueryBuilder()
      .update(Encode)
      .set({ progress })
      .where('_id = :_id', { _id })
      .execute();
    await conn.close();
    return;
  }

  static async insert(target: string) {
    const conn = await createConnection();
    await conn
      .createQueryBuilder()
      .insert()
      .into(Encode)
      .values({
        target,
        date: new Date(),
      })
      .execute();
    await conn.close();
    return;
  }
}
