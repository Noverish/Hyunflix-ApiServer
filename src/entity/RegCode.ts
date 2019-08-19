import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

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
    return await getConnection()
      .getRepository(RegCode)
      .createQueryBuilder()
      .where('code = :code', { code })
      .getOne();
  }

  static async add(code: string, realname: string) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(RegCode)
      .values({ code, realname, date: new Date() })
      .execute();
  }
}
