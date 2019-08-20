import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

@Entity({ name: 'musics' })
export class Music {
  @PrimaryGeneratedColumn()
  music_id: number;

  @Column()
  title: string;

  @Column()
  path: string;
  
  @Column()
  duration: number;

  @Column()
  artist: string;
  
  static async truncate() {
    return await getConnection()
      .getRepository(Music)
      .query('TRUNCATE musics');
  }
  
  static async insertOne(title: string, path: string, duration: number, artist: string) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Music)
      .values({ title, path, duration, artist })
      .execute();
  }
}
