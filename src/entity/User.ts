import { Entity, PrimaryGeneratedColumn, Column, createConnection } from 'typeorm';

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
    const conn = await createConnection();
    const repo = conn.getRepository(User);
    const user = await repo.find({ where: { username } });
    await conn.close();
    return (user.length > 0) ? user[0] : null;
  }

  static async findByUserId(user_id: number): Promise<User | null> {
    const conn = await createConnection();
    const repo = conn.getRepository(User);
    const user = await repo.find({ where: { user_id } });
    await conn.close();
    return (user.length > 0) ? user[0] : null;
  }

  static async insert(user_id: number, username: string, password: string): Promise<User> {
    const conn = await createConnection();

    await conn
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ user_id, username, password, date: new Date() })
      .execute();

    const user: User = await conn
      .getRepository(User)
      .createQueryBuilder()
      .where('user_id = :user_id', { user_id })
      .getOne();

    await conn.close();

    return user;
  }
}
