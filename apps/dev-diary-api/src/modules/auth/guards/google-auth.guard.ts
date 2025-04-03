import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// interface RequestWithLogin extends Request {
//   logIn: (user: any, done: (error: any) => void) => void;
// }

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
