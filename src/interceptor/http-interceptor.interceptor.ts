import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as bytes from 'bytes';
import * as requestIp from 'request-ip';
import { NO_LOG } from '../contants';
import { Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: Logger,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    const ip = requestIp.getClientIp(req);

    // Time: ${Date.now() - req.timestamp} ms
    return next.handle().pipe(
      map((data) => {
        const dataString = JSON.stringify({
          data,
          code: 200,
          message: '请求成功',
        });
        const logFormat = `  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${ip}
    User: ${(req.user && JSON.stringify(req.user)) ?? '未登录'}
    RequestId: ${req.uuid}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    Size: ${bytes(dataString.length).toUpperCase()}
    Time: ${Date.now() - req.timestamp} ms
    Response data: ${dataString}\n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
        if (!this.reflector.get(NO_LOG, context.getHandler())) {
          this.logger.log(logFormat);
        }
        return {
          data,
          code: 200,
          requestId: req.uuid,
          message: '请求成功',
        };
      }),
    );
  }
}
