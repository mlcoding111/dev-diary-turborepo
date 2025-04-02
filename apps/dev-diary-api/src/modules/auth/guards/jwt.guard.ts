import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRepository } from '@/models/user/user.repository';
import { ClsService } from 'nestjs-cls';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly clsService: ClsService,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = (await super.canActivate(context)) as boolean;

    const user = await this.userRepository.findOneBy({
      id: request.user.sub,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const serializedUser = instanceToPlain(user, {
      enableImplicitConversion: true,
    });

    this.clsService.set('user', serializedUser);
    this.clsService.set('request', request);

    return canActivate;
  }
}
