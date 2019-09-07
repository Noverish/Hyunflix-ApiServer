import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  date: Date;

  static async findByUsername(username: string): Promise<User | null> {
    return await getConnection()
      .getRepository(User)
      .createQueryBuilder()
      .where('username = :username', { username })
      .getOne();
  }

  static async findByUserId(user_id: number): Promise<User | null> {
    return await getConnection()
      .getRepository(User)
      .createQueryBuilder()
      .where('user_id = :user_id', { user_id })
      .getOne();
  }

  static async insert(user_id: number, username: string, password: string): Promise<User> {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ user_id, username, password, date: new Date() })
      .execute();

    return await getConnection()
      .getRepository(User)
      .createQueryBuilder()
      .where('user_id = :user_id', { user_id })
      .getOne();
  }
}
