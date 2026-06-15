import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@/shared/decorators/current-user.decorator';
import { ApiErrorCode } from '@/shared/errors/api-error-codes';
import { apiException } from '@/shared/errors/api.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: { sub: string; email: string; name: string }): JwtPayload {
    if (!payload.sub) {
      throw apiException(
        HttpStatus.UNAUTHORIZED,
        ApiErrorCode.AUTHENTICATION_REQUIRED,
        'Authentication required',
      );
    }
    return { sub: payload.sub, email: payload.email, name: payload.name };
  }
}
