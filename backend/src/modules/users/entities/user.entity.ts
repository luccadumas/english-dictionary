export class UserEntity {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  toResponse(): Omit<UserEntity, 'password' | 'toResponse'> {
    const { password: _password, toResponse: _toResponse, ...rest } = this;
    void _password;
    void _toResponse;
    return rest;
  }
}
