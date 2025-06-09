import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: any) {
    // const accessToken = req.cookies['access_token']; // 👈 Your cookie
    // console.log('Access token:', accessToken);

    // console.log('Request...');
    next();
  }
}
