import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
// import { JwtService } from '@nestjs/jwt';
// import { ApiException } from '@/core/exceptions/api.exception';
// import { HttpStatus } from '@nestjs/common';
// import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    // private jwtService: JwtService,
  ) {}

//   async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
//     return await this.usersRepository.update(userId, {
//       hashed_refresh_token: hashedRefreshToken,
//     });
//   }

//   async findAll(): Promise<User[]> {
//     return this.usersRepository.find();
//   }

//   async findOne(id: number): Promise<User | undefined> {
//     return this.usersRepository.findOne({ where: { id } });
//   }

//   async findOneByEmail(email: string): Promise<User | undefined> {
//     return this.usersRepository.findOne({ where: { email } });
//   }

//   async create(user: User): Promise<User> {
//     return this.usersRepository.save(user);
//   }

//   // Update user
//   async update(id: number, user: User): Promise<User> {
//     const updatedUser = await this.usersRepository.findOne({ where: { id } });
//     const mergedUser = this.usersRepository.merge(updatedUser, user);
//     const savedUser = await this.usersRepository.save(mergedUser);

//     return await this.usersRepository.save(savedUser);
//   }

//   // Delete user
//   async delete(id: number): Promise<DeleteResult> {
//     return await this.usersRepository.delete(id);
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
