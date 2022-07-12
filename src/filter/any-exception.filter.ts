import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as requestIp from 'request-ip';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const req = ctx.getRequest();
    const ip = requestIp.getClientIp(req);
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${ip}
    RequestId: ${req.uuid}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    Time: ${Date.now() - req.timestamp} ms
    Status code: ${status}
    Response: ${exception.message} 
    ErrorStack: ${exception.stack}
    \n <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    this.logger.error(logFormat);
    response.status(HttpStatus.OK).json({
      code: status,
      requestID: req.uuid,
      message:
        process.env.NODE_ENV === 'production'
          ? '网络开小差了啦～'
          : exception.message,
      timestamp: Date.now(),
    });
  }
}
