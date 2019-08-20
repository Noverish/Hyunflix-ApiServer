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
  duration: number;

  @Column()
  resolution: string;

  @Column()
  date: Date;

  static async get(): Promise<Movie[]> {
    return await getConnection()
      .getRepository(Movie)
      .createQueryBuilder()
      .orderBy("movie_id", "DESC")
      .getMany();
  }
  
  static async findById(movie_id: number): Promise<Movie | null> {
    return await getConnection()
      .getRepository(Movie)
      .createQueryBuilder()
      .where('movie_id = :movie_id', { movie_id })
      .getOne();
  }
  
  static async updateOne(movie_id: number, query: object) {
    return await getConnection()
      .getRepository(Movie)
      .createQueryBuilder()
      .update()
      .set(query)
      .where('movie_id = :movie_id', { movie_id })
      .execute();
  }
}
