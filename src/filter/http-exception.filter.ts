import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import * as requestIp from 'request-ip';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const req = ctx.getRequest();
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
    const ip = requestIp.getClientIp(req);
    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    const exceptionResponse: any = exception.getResponse();
    let validatorMessage = exceptionResponse;
    if (typeof validatorMessage === 'object') {
      validatorMessage =
        exceptionResponse.message.constructor === Array
          ? exceptionResponse.message[0]
          : exceptionResponse.message;
    }
    const errorResponse = {
      // data: {},
      message: validatorMessage ?? message,
      code: status,
      path: req.url,
      RequestId: req.uuid,
      timestamp: Date.now(),
    };
    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    req original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${ip}
    RequestId: ${req.uuid}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    Time: ${Date.now() - req.timestamp} ms
    Status code: ${status}
    Response: ${JSON.stringify(
      errorResponse,
    )} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    if (status !== 200) {
      this.logger.error(logFormat);
    } else {
      this.logger.error(logFormat);
    }

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(200).json(errorResponse);
  }
}
