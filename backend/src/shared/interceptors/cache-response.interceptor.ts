import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

const CACHEABLE_PATHS = ['/entries/en'];

@Injectable()
export class CacheResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();
    const response = context.switchToHttp().getResponse<Response>();
    const request = context.switchToHttp().getRequest<Request>();

    const isCacheable = CACHEABLE_PATHS.some((path) =>
      request.path.startsWith(path),
    );

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        response.setHeader('x-response-time', String(elapsed));
        if (isCacheable && !response.getHeader('x-cache')) {
          response.setHeader('x-cache', 'MISS');
        }
      }),
    );
  }
}
