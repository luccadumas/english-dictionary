import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpUseCase } from './signup.use-case';
import { SignInUseCase } from './signin.use-case';
import { USERS_REPOSITORY } from '@/modules/users/repositories/users.repository.interface';
import { UserEntity } from '@/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

describe('Auth Use Cases', () => {
  let signUpUseCase: SignUpUseCase;
  let signInUseCase: SignInUseCase;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUseCase,
        SignInUseCase,
        { provide: USERS_REPOSITORY, useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    signUpUseCase = module.get<SignUpUseCase>(SignUpUseCase);
    signInUseCase = module.get<SignInUseCase>(SignInUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  describe('SignUpUseCase', () => {
    it('should create a user and return token', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockUsersRepository.create.mockResolvedValue(
        new UserEntity({
          id: 'user-1',
          name: 'John',
          email: 'john@example.com',
          password: 'hashed',
        }),
      );

      const result = await signUpUseCase.execute({
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result.id).toBe('user-1');
      expect(result.name).toBe('John');
      expect(result.token).toContain('Bearer');
    });

    it('should throw ConflictException if email is taken', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(
        new UserEntity({ id: 'user-1', email: 'john@example.com' }),
      );

      await expect(
        signUpUseCase.execute({
          name: 'John',
          email: 'john@example.com',
          password: 'pass123',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('SignInUseCase', () => {
    it('should sign in and return token', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      mockUsersRepository.findByEmail.mockResolvedValue(
        new UserEntity({
          id: 'user-1',
          name: 'John',
          email: 'john@example.com',
          password: hashed,
        }),
      );

      const result = await signInUseCase.execute({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result.token).toContain('Bearer');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      mockUsersRepository.findByEmail.mockResolvedValue(
        new UserEntity({
          id: 'user-1',
          name: 'John',
          email: 'john@example.com',
          password: hashed,
        }),
      );

      await expect(
        signInUseCase.execute({ email: 'john@example.com', password: 'wrong' }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);

      await expect(
        signInUseCase.execute({
          email: 'nonexistent@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(HttpException);
    });
  });
});
