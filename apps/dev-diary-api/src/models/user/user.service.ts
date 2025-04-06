import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { BaseService } from '@/core/utils/service/base.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/entities/user.entity';

import { AuthJwtPayload } from '@/modules/auth/types/jwt-payload';
@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    super(userRepository);
  }

  async updateHashedRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
    refreshToken?: string | null,
  ) {
    // If there is a refreshToken, take it. Else, if hashedRefreshToken is null, set refreshToken to null.
    // Else, if there is no refreshToken, do not save anything.
    const refreshTokenToSave =
      refreshToken ?? (hashedRefreshToken ? null : undefined);
    return await this.userRepository.save({
      id: userId,
      hashed_refresh_token: hashedRefreshToken,
      ...(refreshTokenToSave && { refresh_token: refreshTokenToSave }),
    });
  }

  async getUserFromHeadersToken(
    req: Request & { headers: { authorization?: string } },
  ): Promise<User | null> {
    const authHeader = req.headers.authorization as string;

    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        // console.log('THere')
        const payload: AuthJwtPayload = this.jwtService.verify(token);
        console.log('payload', payload);
        if (payload) {
          const user = await this.userRepository.findOne({
            relations: ['userWorkspaces'],
            where: { id: payload.sub },
          });
          if (!user) {
            console.log('User not found');
            // throw new ApiException({
            //     http_status_code: HttpStatus.UNAUTHORIZED,
            //     error_code: 'INVALID_TOKEN',
            // });
          }

          return user;
        } else {
          // Payload is invalid
          console.log('Payload is invalid');
          // throw new ApiException({
          //     http_status_code: HttpStatus.UNAUTHORIZED,
          //     error_code: 'INVALID_TOKEN',
          // });
        }
      }
    }

    return null;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
