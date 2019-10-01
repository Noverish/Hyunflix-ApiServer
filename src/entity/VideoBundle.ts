import { Entity, PrimaryGeneratedColumn, Column, OneToMany, getConnection } from 'typeorm';

import { VideoArticle } from '@src/entity';
import { IVideoBundle } from '@src/models';

@Entity()
export class VideoBundle {
  @PrimaryGeneratedColumn()
  bundleId: number;

  @OneToMany(type => VideoArticle, article => article.bundle)
  articles: VideoArticle[];

  @Column()
  title: string;

  @Column({ default: '' })
  category: string;

  static async findByCategory(category: string): Promise<VideoBundle[]> {
    return await getConnection()
      .getRepository(VideoBundle)
      .createQueryBuilder()
      .where('category = :category', { category })
      .getMany();
  }

  static async findByCategoryAndId(category: string, bundleId: number): Promise<VideoBundle | null> {
    return await getConnection()
      .getRepository(VideoBundle)
      .createQueryBuilder()
      .leftJoinAndSelect('VideoBundle.articles', 'video_article')
      .where('category = :category && bundleId = :bundleId', { category, bundleId })
      .getOne();
  }

  convert(): IVideoBundle {
    return {
      bundleId: this.bundleId,
      articles: (this.articles || []).map(a => a.convert()),
      title: this.title,
      category: this.category,
    };
  }
}
