import { Entity, PrimaryColumn, Column, getConnection, Connection } from 'typeorm';
import { dateToString } from '@src/utils/date';

@Entity({ name: 'movies' })
export class MovieEntity {
  @PrimaryColumn({ name: 'video_id' })
  videoId: number;

  @Column()
  title: string;

  @Column()
  date: Date;
}

export class Movie {
  videoId: number;
  title: string;
  date: string;
  
  constructor(e: MovieEntity) {
    this.videoId = e.videoId;
    this.title = e.title;
    this.date = dateToString(e.date);
  }
  
  static async insert(videoId: number, title: string, date: Date): Promise<void> {
    const movie = new MovieEntity();
    movie.videoId = videoId;
    movie.title = title;
    movie.date = date;
    
    await getConnection()
      .getRepository(MovieEntity)
      .save(movie);
  }

  static async findAll(): Promise<Movie[]> {
    const es = await getConnection()
      .getRepository(MovieEntity)
      .createQueryBuilder()
      .orderBy("video_id", "DESC")
      .getMany();
    return es.map(e => new Movie(e));
  }
  
  static async findById(videoId: number): Promise<Movie | null> {
    const e = await getConnection()
      .getRepository(MovieEntity)
      .createQueryBuilder()
      .where('video_id = :video_id', { videoId })
      .getOne();
    return (e) ? new Movie(e) : null;
  }
  
  static async updateOne(videoId: number, query: object) {
    return await getConnection()
      .getRepository(MovieEntity)
      .createQueryBuilder()
      .update()
      .set(query)
      .where('video_id = :video_id', { videoId })
      .execute();
  }
}