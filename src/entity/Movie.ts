import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryGeneratedColumn()
  movie_id: number;

  @Column()
  title: string;

  @Column()
  path: string;

  @Column()
  date: Date;

  static async get(): Promise<Movie[]> {
    return await getConnection()
      .getRepository(Movie)
      .createQueryBuilder()
      .getMany();
  }

  static async findByPath(path: string): Promise<Movie | null> {
    return await getConnection()
      .getRepository(Movie)
      .createQueryBuilder()
      .where('path = :path', { path })
      .getOne();
  }
}
