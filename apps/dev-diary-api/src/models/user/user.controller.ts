import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  //   NotFoundException,
  Put,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
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
  private static readonly serializedUserSchema =
    userSchemaSerialized as z.ZodSchema<TSerializedUser>;

  constructor(
    private readonly usersService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Validate({
    output: z.array(UserController.serializedUserSchema),
  })
  @Get()
  findAll(): User[] {
    // const users = await this.userRepository.find();
    return MOCK_USERS.map((user) => new User(user));
  }

  @Validate({
    output: UserController.serializedUserSchema,
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new User(user);
  }

  @Validate({
    output: UserController.serializedUserSchema,
  })
  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() user: User): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });

    // User does not exist
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.mergeAndUpdate(userToUpdate, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.remove(user);
  }
}
