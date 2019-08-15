import { Entity, PrimaryGeneratedColumn, Column, getConnection, createConnection } from 'typeorm';

@Entity({ name: 'reg_codes' })
export class RegCode {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  realname: string;

  @Column()
  code: string;

  @Column()
  date: Date;

  static async getRegCode(code: string): Promise<RegCode | null> {
    const conn = await createConnection();
    const repo = conn.getRepository(RegCode);
    const regCode = await repo.find({ where: { code } });
    await conn.close();
    return (regCode.length > 0) ? regCode[0] : null;
  }

  static async add(code: string, realname: string) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(RegCode)
      .values([
          { code, realname, date: new Date() },
      ])
      .execute();
  }
}
