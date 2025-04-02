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
  ): Promise<PaginatedResult<TSerializedUser>> {
    return await this.userService.paginate(query);
  }

  @Validate({
    output: UserController.serializedUserSchema,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TSerializedUser> {
    const user = await this.getUser(id);

    return this.serializeUser(user);
  }

  @Validate({
    output: UserController.serializedUserSchema,
  })
  @Post()
  async create(@Body() user: User): Promise<TSerializedUser> {
    return await this.userRepository.save(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: User,
  ): Promise<TSerializedUser> {
    const userToUpdate = await this.getUser(id);

    return await this.userRepository.mergeAndUpdate(userToUpdate, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<TSerializedUser> {
    const user = await this.getUser(id);

    return await this.userRepository.remove(user);
  }

  private serializeUser(user: User): TSerializedUser {
    return new User(user);
  }

  private async getUser(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
