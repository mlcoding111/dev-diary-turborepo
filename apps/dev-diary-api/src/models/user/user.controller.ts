import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Validate } from 'src/decorators/validation.decorator';
import { z } from 'zod';
import { userSchemaSerialized, type TSerializedUser } from '@repo/types/schema';
import { UserRepository } from '../user/user.repository';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import {
  PaginatedResult,
  type PaginationOptions,
} from '@/core/utils/service/base.service';
// import { UserSerializer } from '@/serializers/user.serializer';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  private static readonly serializedUserSchema =
    userSchemaSerialized as z.ZodSchema<TSerializedUser>;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  @Validate({
    output: z.array(UserController.serializedUserSchema),
    pagination: true,
  })
  @Get()
  async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    return await this.userService.paginate(query);
  }

  @Validate({
    output: UserController.serializedUserSchema,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ first_name: string }> {
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new User(user);
  }
  // @Validate({
  //   output: UserController.serializedUserSchema,
  // })
  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<{ first_name: string }> {
  //   const user: User | null = await this.userRepository.findOne({
  //     where: { id },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return new User(user);
  // }

  @Validate({
    output: UserController.serializedUserSchema,
  })
  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });

    // User does not exist
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.mergeAndUpdate(userToUpdate, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userRepository.remove(user);
  }

  private serializeUser(user: User): User {
    return new User(user);
  }
}
