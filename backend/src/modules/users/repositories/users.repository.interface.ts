import { UserEntity } from '../entities/user.entity';

export interface IUsersRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(data: { name: string; email: string; password: string }): Promise<UserEntity>;
}

export const USERS_REPOSITORY = Symbol('IUsersRepository');
