import { Entity, PrimaryGeneratedColumn, Column, OneToMany, getConnection } from 'typeorm';

import { VideoArticle } from '@src/entity';
import { IVideoBundle } from '@src/models';

@Entity()
export class VideoBundle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(type => VideoArticle, article => article.bundle)
  articles: VideoArticle[];

  @Column()
  title: string;

  @Column({ default: '' })
  category: string;

  static async findAllCategories(): Promise<string[]> {
    const tmp = await getConnection()
      .getRepository(VideoBundle)
      .createQueryBuilder()
      .select('category')
      .groupBy('category')
      .getRawMany();
    return tmp.map(t => t['category']);
  }

  static async findByCategory(category: string): Promise<VideoBundle[]> {
    return await getConnection()
      .getRepository(VideoBundle)
      .find({
        relations: ['articles'],
        where: { category },
      });
  }

  static async findByCategoryAndId(category: string, id: number): Promise<VideoBundle | null> {
    return await getConnection()
      .getRepository(VideoBundle)
      .findOne({
        relations: ['articles', 'articles.videos'],
        where: { category, id },
      });
  }

  convert(): IVideoBundle {
    return {
      id: this.id,
      articles: (this.articles || []).map(a => a.convert()),
      title: this.title,
      category: this.category,
    };
  }
}
