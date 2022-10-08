import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { logFormat } from '../util/log-format';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    this.logger.error(
      logFormat(req, exception, status, req.uuid, req.timestamp),
      exception.stack,
    );
    const errorResponse = {
      code: status,
      requestID: req.uuid,
      errorMessage:
        process.env.NODE_ENV === 'production'
          ? '网络开小差了啦～'
          : exception.message,
      timestamp: Date.now(),
    };
    response.status(HttpStatus.OK).json(errorResponse);
  }
}
