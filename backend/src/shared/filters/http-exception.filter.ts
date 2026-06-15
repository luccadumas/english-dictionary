import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    let code: string | undefined;
    let params: Record<string, string | number> | undefined;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseBody = exceptionResponse as {
          message: unknown;
          code?: unknown;
          params?: unknown;
        };
        const msg = responseBody.message;
        message = Array.isArray(msg) ? msg.join(', ') : String(msg);

        if (typeof responseBody.code === 'string') {
          code = responseBody.code;
        }

        if (
          responseBody.params &&
          typeof responseBody.params === 'object' &&
          !Array.isArray(responseBody.params)
        ) {
          params = responseBody.params as Record<string, string | number>;
        }
      }
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      message,
      ...(code ? { code } : {}),
      ...(params ? { params } : {}),
    });
  }
}
