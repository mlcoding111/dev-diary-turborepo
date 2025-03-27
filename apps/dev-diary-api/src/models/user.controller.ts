import {
  Controller,
  Get,
  //   Post,
  //   Body,
  //   Param,
  //   NotFoundException,
  //   Put,
  //   Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Validate } from 'src/decorators/validation.decorator';
// import { User } from '../entities/user.entity';
// import { UserSerializer } from './serializers/user.serializer';
// import { DeleteResult } from 'typeorm';
import { z } from 'zod';
import { UserRepository } from './user.repository';
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Validate({
    output: z.array(
      z.object({
        id: z.number(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    ),
  })
  @Get()
  async findAll(): Promise<any[]> {
    await this.userRepository.find();
    return await new Promise((resolve) => {
      resolve([
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password',
          hashed_refresh_token: 'hashed_refresh_token',
          refresh_token: 'refresh_token',
        },
      ]);
    });
  }

  //   @Get(':id')
  //   async findOne(@Param('id') id: number): Promise<User> {
  //     const user: User = await this.usersService.findOne(id);
  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }
  //     return new User(user);
  //   }

  //   @Post()
  //   async create(@Body() user: User): Promise<User> {
  //     return await this.usersService.create(user);
  //   }

  //   @Put(':id')
  //   async update(@Param('id') id: number, @Body() user: User): Promise<User> {
  //     return await this.usersService.update(id, user);
  //   }

  //   @Delete(':id')
  //   async delete(@Param('id') id: number): Promise<DeleteResult> {
  //     const user = await this.usersService.findOne(id);
  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }

  //     return await this.usersService.delete(id);
  //   }
}
