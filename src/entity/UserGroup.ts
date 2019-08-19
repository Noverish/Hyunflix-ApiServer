import { Entity, PrimaryGeneratedColumn, Column, getConnection } from 'typeorm';

@Entity({ name: 'user_groups' })
export class UserGroup {
  @PrimaryGeneratedColumn()
  group_id: number;

  @Column()
  name: string;
  
  static async find(group_id: number): Promise<UserGroup> {
    return await getConnection()
      .getRepository(UserGroup)
      .createQueryBuilder()
      .where('group_id = :group_id', { group_id })
      .getOne();
  }
}
