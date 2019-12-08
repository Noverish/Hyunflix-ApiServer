import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

import { Music } from '@src/entity';
import { IMusicPlaylist } from '@src/models';

@Entity()
export class MusicPlaylist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @ManyToMany(type => Music)
  @JoinTable()
  musics: Music[];

  convert(): IMusicPlaylist {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      musics: this.musics.map(v => v.convert()),
    };
  }
}
