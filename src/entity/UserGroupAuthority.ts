import { Entity, PrimaryColumn, getConnection } from 'typeorm';

@Entity({ name: 'user_groups_authority' })
export class UserGroupAuthority {
  @PrimaryColumn()
  group_id: number;

  @PrimaryColumn()
  path: string;
  
  static async findAll(group_id: number): Promise<UserGroupAuthority[]> {
    return await getConnection()
      .getRepository(UserGroupAuthority)
      .createQueryBuilder()
      .where('group_id = :group_id', { group_id })
      .getMany();
  }
}
