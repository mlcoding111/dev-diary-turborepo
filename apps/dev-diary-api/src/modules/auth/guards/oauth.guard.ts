import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RequestContextService } from '@/modules/request/request-context.service';

@Injectable()
export class DynamicAuthGuard extends AuthGuard('oauth') {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestContextService: RequestContextService,
  ) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return { session: false, state: request.params.provider };
  }
}
