// dynamic-auth.guard.ts
import { ExecutionContext, Injectable, mixin } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestContextService } from '@/modules/request/request-context.service';

export function DynamicAuthGuardFactory(providerParamKey = 'provider') {
  @Injectable()
  class DynamicAuthGuard extends AuthGuard('') {
    constructor(readonly requestContextService: RequestContextService) {
      super();
    }

    getAuthenticateOptions(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const provider = request.params?.[providerParamKey];

      if (!provider) {
        throw new Error('Provider not specified in route param');
      }

      const user = this.requestContextService.get('user');

      return {
        session: false,
        state: JSON.stringify({
          redirect: '/dashboard',
          timestamp: Date.now(),
          user: user ? { id: user.id, email: user.email } : null,
          provider,
        }),
      };
    }

    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const provider = request.params?.[providerParamKey];

      if (!provider) throw new Error('Provider not specified in route param');

      // Dynamically bind the provider to AuthGuard
      const Guard = AuthGuard(provider);
      const guard = new Guard();
      return guard.canActivate(context);
    }
  }

  return mixin(DynamicAuthGuard);
}
