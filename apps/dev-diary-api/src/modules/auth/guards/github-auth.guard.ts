import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestContextService } from '@/modules/request/request-context.service';

@Injectable()
export class GitHubAuthGuard extends AuthGuard('github') {
  constructor(private readonly requestContextService: RequestContextService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    // console.log('🚀 GitHubAuthGuard context:', context);
    const user = this.requestContextService.get('user');
    console.log('🚀 GitHubAuthGuard user:', user);

    return {
      state: JSON.stringify({
        foo: 'bar', // your custom payload
        redirect: '/dashboard', // example
        timestamp: Date.now(),
        user: {
          sub: user?.sub,
          email: user?.email,
        },
      }),
    };
  }
}
