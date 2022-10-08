import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { logFormat } from '../util/log-format';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const req = ctx.getRequest();
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码
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
      message: validatorMessage ?? message,
      code: status,
      path: req.url,
      RequestId: req.uuid,
      timestamp: Date.now(),
    };

    if (status !== 200) {
      this.logger.error(
        logFormat(req, errorResponse, status, req.uuid, req.timestamp),
      );
    } else {
      this.logger.log(
        logFormat(req, errorResponse, status, req.uuid, req.timestamp),
      );
    }
    // 设置返回的状态码， 请求头，发送错误信息
    response.status(200).json(errorResponse);
  }
}
