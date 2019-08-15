import { Entity, PrimaryGeneratedColumn, Column, createConnection } from 'typeorm';

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
    const conn = await createConnection();
    const repo = conn.getRepository(Movie);
    const movies = await repo.find();
    await conn.close();
    return movies;
  }

  static async findByPath(path: string): Promise<Movie | null> {
    const conn = await createConnection();
    const repo = conn.getRepository(Movie);
    const movies = await repo.find({ where: { path } });
    await conn.close();
    return (movies.length > 0) ? movies[0] : null;
  }
}
