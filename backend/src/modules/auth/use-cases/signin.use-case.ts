import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  IUsersRepository,
  USERS_REPOSITORY,
} from '@/modules/users/repositories/users.repository.interface';
import { SignInDto } from '../dtos/signin.dto';
import { AuthResponseDto } from '../dtos/signup.dto';

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: SignInDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

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
