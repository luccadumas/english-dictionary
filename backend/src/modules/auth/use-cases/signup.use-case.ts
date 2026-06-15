import { Inject, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from '@/modules/users/repositories/users.repository.interface';
import { ApiErrorCode } from '@/shared/errors/api-error-codes';
import { apiException } from '@/shared/errors/api.exception';
import { SignUpDto, AuthResponseDto } from '../dtos/signup.dto';

@Injectable()
export class SignUpUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: SignUpDto): Promise<AuthResponseDto> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw apiException(
        HttpStatus.CONFLICT,
        ApiErrorCode.EMAIL_ALREADY_IN_USE,
        'Email already in use',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      id: user.id,
      name: user.name,
      token: `Bearer ${token}`,
    };
  }
}
