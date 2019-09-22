import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

@Entity({ name: 'Music' })
export class Music {
  @PrimaryGeneratedColumn({ name: 'music_id' })
  musicId: number;

  @Column()
  title: string;

  @Column()
  path: string;
  
  @Column()
  duration: number;

  @Column()
  artist: string;
  
  @Column()
  tags: string;
  
  @Column()
  authority: string;
  
  static async truncate() {
    return await getConnection()
      .getRepository(Music)
      .query('TRUNCATE Music');
  }
  
  static async insertOne(title: string, path: string, duration: number, artist: string, tags: string, authority: string) {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Music)
      .values({ title, path, duration, artist, tags, authority })
      .execute();
  }
  
  static async findAll(): Promise<Music[]> {
    return await getConnection()
      .getRepository(Music)
      .createQueryBuilder()
      .getMany();
  }
  
  static async findTags(): Promise<string[]> {
    const tmp = await getConnection()
      .getRepository(Music)
      .createQueryBuilder()
      .select('tags')
      .groupBy('tags')
      .getRawMany();
    return tmp.map(t => t['tags']);
  }
}
