import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestLogsMiddleware implements NestMiddleware {
  async use(
    req: Request & { uuid: string; timestamp: number },
    res: Response,
    next: NextFunction,
  ) {
    req.uuid = uuidv4();
    req.timestamp = Date.now();
    next();
  }
}
