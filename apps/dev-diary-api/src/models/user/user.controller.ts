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
import { z } from 'zod';
import { userSchemaSerialized, type TSerializedUser } from '@repo/types/schema';
import { UserRepository } from '../user/user.repository';
import { User } from 'src/entities/user.entity';

const MOCK_USERS: User[] = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    hashed_refresh_token: 'hashed_refresh_token',
    refresh_token: 'refresh_token',
    created_at: new Date(),
    updated_at: new Date(),
    password: 'password',
  },
];

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
  findAll(): TSerializedUser[] {
    // const users = await this.userRepository.find();
    return MOCK_USERS.map((user) => new User(user));
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
