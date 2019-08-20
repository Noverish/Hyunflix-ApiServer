import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';
import { dateToString } from '@src/utils/date';

@Entity({ name: 'movies' })
export class MovieEntity {
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
}

export class Movie {
  movie_id: number;
  title: string;
  path: string;
  duration: number;
  resolution: string[];
  date: string;
  
  constructor(e: MovieEntity) {
    this.movie_id = e.movie_id;
    this.title = e.title;
    this.path = e.path;
    this.duration = e.duration;
    this.resolution = e.resolution.split(',');
    this.date = dateToString(e.date);
  }

  static async get(): Promise<Movie[]> {
    const es = await getConnection()
      .getRepository(MovieEntity)
      .createQueryBuilder()
      .orderBy("movie_id", "DESC")
      .getMany();
    return es.map(e => new Movie(e));
  }
  
  static async findById(movie_id: number): Promise<Movie | null> {
    const e = await getConnection()
      .getRepository(MovieEntity)
      .createQueryBuilder()
      .where('movie_id = :movie_id', { movie_id })
      .getOne();
    return (e) ? new Movie(e) : null;
  }
  
  static async updateOne(movie_id: number, query: object) {
    return await getConnection()
      .getRepository(MovieEntity)
      .createQueryBuilder()
      .update()
      .set(query)
      .where('movie_id = :movie_id', { movie_id })
      .execute();
  }
}