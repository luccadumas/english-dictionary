import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignUpDto, AuthResponseDto } from '../dtos/signup.dto';
import { SignInDto } from '../dtos/signin.dto';
import { SignUpUseCase } from '../use-cases/signup.use-case';
import { SignInUseCase } from '../use-cases/signin.use-case';
import { ErrorResponseDto } from '@/shared/dtos/cursor-paginated.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    return this.signUpUseCase.execute(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async signIn(@Body() dto: SignInDto): Promise<AuthResponseDto> {
    return this.signInUseCase.execute(dto);
  }
}
