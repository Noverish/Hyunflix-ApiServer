import { Entity, PrimaryColumn, Column, getConnection } from 'typeorm';

@Entity()
export class UserVideo {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  articleId: number;
  
  @Column()
  time: number;

  @Column()
  date: Date;
  
  static async find(userId: number, articleId: number): Promise<UserVideo | null> {
    return await getConnection()
      .getRepository(UserVideo)
      .findOne({ where: { userId, articleId }});
  }
  
  static async insert(userId: number, articleId: number) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(UserVideo)
      .values({ userId, articleId })
      .execute();
  }
  
  static async update(userId: number, articleId: number, time: number) {
    await getConnection()
      .createQueryBuilder()
      .update(UserVideo)
      .set({ time, date: new Date() })
      .where({ userId, articleId })
      .execute();
  }
}
