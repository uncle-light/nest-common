import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { NO_LOG } from '../contants';
import { Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { logFormat } from '../util/log-format';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private logger = new Logger(HttpInterceptor.name);
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    // Time: ${Date.now() - req.timestamp} ms
    return next.handle().pipe(
      map((data) => {
        const response = {
          data,
          code: 200,
          requestId: req.uuid,
          message: '请求成功',
        };
        if (!this.reflector.get(NO_LOG, context.getHandler())) {
          this.logger.log(
            logFormat(req, response, 200, req.uuid, req.timestamp),
          );
        }
        return response;
      }),
    );
  }
}
