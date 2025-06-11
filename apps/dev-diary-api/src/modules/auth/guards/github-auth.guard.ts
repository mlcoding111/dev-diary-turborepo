import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestContextService } from '@/modules/request/request-context.service';

@Injectable()
export class GitHubAuthGuard extends AuthGuard('github') {
  constructor(private readonly requestContextService: RequestContextService) {
    super();
  }

  getAuthenticateOptions() {
    const user = this.requestContextService.get('user');

    return {
      state: JSON.stringify({
        redirect: '/dashboard',
        timestamp: Date.now(),
        user: {
          sub: user?.sub,
          email: user?.email,
        },
      }),
    };
  }
}
