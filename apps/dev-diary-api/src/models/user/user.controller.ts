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
import { userSchemaSerialized, type TSerializedUser } from '@repo/types/schema';
import { UserRepository } from '../user/user.repository';
import { User } from 'src/entities/user.entity';
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Validate({
    output: z.array(userSchemaSerialized),
  })
  @Get()
  async findAll(): Promise<TSerializedUser[]> {
    const users = await this.userRepository.find();
    const serializedUsers = users.map((user) => new User(user));

    console.log('USERS', users);
    console.log('SERIALIZED USERS', serializedUsers);

    return serializedUsers;
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
