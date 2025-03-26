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
// import { User } from '../entities/user.entity';
// import { UserSerializer } from './serializers/user.serializer';
// import { DeleteResult } from 'typeorm';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async findAll(): Promise<any[]> {
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
