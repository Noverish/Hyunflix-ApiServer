import { Entity, PrimaryColumn, Column, getConnection, Connection } from 'typeorm';

import { dateToString } from '@src/utils/date';

@Entity({ name: 'tv_programs' })
export class TVProgramEntity {
  @PrimaryColumn({ name: 'video_id' })
  videoId: number;

  @Column({ name: 'series_name' })
  seriesName: string;

  @Column({ name: 'episode_name' })
  episodeName: string;

  @Column({ name: 'episode_number' })
  episodeNumber: number;

  @Column({ name: 'broadcast_date' })
  broadcastDate: Date;

  @Column()
  date: Date;
}

export class TVProgram {
  videoId: number;
  seriesName: string;
  episodeName: string;
  episodeNumber: number;
  broadcastDate: string;
  date: string;
  
  constructor(e: TVProgramEntity) {
    this.videoId = e.videoId;
    this.seriesName = e.seriesName;
    this.episodeName = e.episodeName;
    this.episodeNumber = e.episodeNumber;
    this.broadcastDate = dateToString(e.broadcastDate);
    this.date = dateToString(e.date);
  }
  
  static async findAllSeries(): Promise<string[]> {
    const list = await getConnection()
      .getRepository(TVProgramEntity)
      .createQueryBuilder()
      .select('series_name')
      .groupBy('series_name')
      .getMany();
    const list2 = await getConnection()
      .getRepository(TVProgramEntity)
      .query('SELECT series_name FROM tv_programs GROUP BY series_name');
    return list2.map(e => e['series_name']);
  }
  
  static async findAllEpisode(seriesName: string): Promise<TVProgram[]> {
    const list = await getConnection()
      .getRepository(TVProgramEntity)
      .createQueryBuilder()
      .where('series_name = :seriesName', { seriesName })
      .getMany();
    return list.map(e => new TVProgram(e));
  }
  
  static async findByEpisodeNumber(seriesName, episodeNumber): Promise<TVProgram | null> {
    const e = await getConnection()
      .getRepository(TVProgramEntity)
      .createQueryBuilder()
      .where('series_name = :seriesName', { seriesName })
      .andWhere('episode_number = :episodeNumber', { episodeNumber })
      .getOne();
    return new TVProgram(e);
  }
  
  static async insert(videoId: number,
                      seriesName: string,
                      episodeName: string,
                      episodeNumber: number,
                      broadcastDate: Date,
                      date: Date) {
    
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(TVProgramEntity)
      .values({ videoId, seriesName, episodeName, episodeNumber, broadcastDate, date })
      .execute();
  }
  
}