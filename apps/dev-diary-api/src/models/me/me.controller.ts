import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { User } from '@/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserService } from '@/models/user/user.service';
import { Validate } from 'src/decorators/validation.decorator';
import { z } from 'zod';
import { updateMeSchema, userSchemaSerialized } from '@repo/types/schema';
import type { TSerializedUser } from '@repo/types/schema';
import { RequestContextService } from '@/modules/request/request-context.service';

@Controller('me')
@UseInterceptors(ClassSerializerInterceptor)
export class MeController {
  private static readonly serializedMeSchema =
    userSchemaSerialized as z.ZodSchema<TSerializedUser>;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly requestContextService: RequestContextService,
  ) {}

  @Validate({
    output: MeController.serializedMeSchema,
  })
  @Get()
  async find(): Promise<TSerializedUser> {
    const user = this.requestContextService.get('user');
    return await this.userService.getUser(user.id);
  }

  @Validate({
    output: MeController.serializedMeSchema,
    input: updateMeSchema,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: User,
  ): Promise<TSerializedUser> {
    const userToUpdate: User = await this.userService.getUser(id);
    return await this.userRepository.mergeAndUpdate(userToUpdate, user);
  }
}
