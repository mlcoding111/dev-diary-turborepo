import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
// import { JwtService } from '@nestjs/jwt';
// import { ApiException } from '@/core/exceptions/api.exception';
// import { HttpStatus } from '@nestjs/common';
// import { Request } from 'express';
import { BaseService } from '../../core/utils/service/base.service';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    private readonly userRepository: UserRepository,
    // private jwtService: JwtService,
  ) {
    super(userRepository);
  }

//   async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
//     return await this.usersRepository.update(userId, {
//       hashed_refresh_token: hashedRefreshToken,
//     });
//   }

//   // Update user
//   async update(id: number, user: User): Promise<User> {
//     const updatedUser = await this.usersRepository.findOne({ where: { id } });
//     const mergedUser = this.usersRepository.merge(updatedUser, user);
//     const savedUser = await this.usersRepository.save(mergedUser);

//     return await this.usersRepository.save(savedUser);
//   }


//   async getUserFromHeadersToken(req: Request): Promise<User | null> {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//       const [type, token] = authHeader.split(' ');
//       if (type === 'Bearer' && token) {
//         // console.log('THere')
//         const payload = this.jwtService.verify(token);
//         console.log('payload', payload);
//         if (payload) {
//           const user = await this.usersRepository.findOne({
//             relations: ['userWorkspaces'],
//             where: { id: payload.id },
//           });
//           if (!user) {
//             console.log('User not found');
//             // throw new ApiException({
//             //     http_status_code: HttpStatus.UNAUTHORIZED,
//             //     error_code: 'INVALID_TOKEN',
//             // });
//           }

//           return user;
//         } else {
//           // Payload is invalid
//           console.log('Payload is invalid');
//           // throw new ApiException({
//           //     http_status_code: HttpStatus.UNAUTHORIZED,
//           //     error_code: 'INVALID_TOKEN',
//           // });
//         }
//       }
//     }

//     return null;
//   }
}
