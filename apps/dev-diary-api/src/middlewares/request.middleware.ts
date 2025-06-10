import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestContextService } from '@/modules/request/request-context.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly requestContextService: RequestContextService) {}
  use(req: Request, res: Response, next: any) {
    const accessToken = req.cookies['access_token']; // 👈 Your cookie
    // console.log('Access token:', accessToken);
    // decode the access token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    // console.log('Decoded access token:', decoded);
    this.requestContextService.set('user', decoded);
    // console.log('Request...');
    next();
  }
}
