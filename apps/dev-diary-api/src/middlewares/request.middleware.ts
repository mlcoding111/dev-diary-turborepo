import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestContextService } from '@/modules/request/request-context.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}
  use(req: any, res: Response, next: any) {
    // if the request route does not start with auth, skip the middleware
    // if (!req.url.startsWith('/auth')) return next();

    const accessToken = req.cookies['access_token'];
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      // console.log('decoded', decoded);
      this.requestContextService.set('user', decoded);
    } catch (error: any) {
      console.log('Error decoding access token:', error.message);
    }
    next();
  }
}
