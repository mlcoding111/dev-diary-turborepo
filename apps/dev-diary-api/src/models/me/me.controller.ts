import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Me } from '@/entities/me.entity';
import { MeRepository } from './me.repository';
import { MeService } from './me.service';
import { Validate } from 'src/decorators/validation.decorator';
import { z } from 'zod';
import {
  PaginatedResult,
  type PaginationOptions,
} from '@/core/utils/service/base.service';
import {
  meSchemaSerialized,
  createMeSchema,
  updateMeSchema,
} from '@repo/types/schema';
import type { TSerializedMe } from '@repo/types/schema';
@Controller('mes')
@UseInterceptors(ClassSerializerInterceptor)
export class MeController {
  private static readonly serializedMeSchema =
    meSchemaSerialized as z.ZodSchema<TSerializedMe>;

  constructor(
    private readonly meRepository: MeRepository,
    private readonly meService: MeService,
  ) {}

  @Validate({
    output: z.array(MeController.serializedMeSchema),
    pagination: true,
  })
  @Get()
  async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedResult<TSerializedMe>> {
    return await this.meService.paginate(query);
  }

  @Validate({
    output: MeController.serializedMeSchema,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TSerializedMe> {
    const me = await this.getMe(id);
    return this.serializeMe(me);
  }

  @Validate({
    output: MeController.serializedMeSchema,
    input: createMeSchema,
  })
  @Post()
  async create(@Body() me: Me): Promise<TSerializedMe> {
    return await this.meRepository.save(me);
  }

  @Validate({
    output: MeController.serializedMeSchema,
    input: updateMeSchema,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() me: Me,
  ): Promise<TSerializedMe> {
    const meToUpdate = await this.getMe(id);
    return await this.meRepository.mergeAndUpdate(meToUpdate, me);
  }

  @Validate({
    output: MeController.serializedMeSchema,
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<TSerializedMe> {
    const me = await this.getMe(id);
    return await this.meRepository.remove(me);
  }

  private serializeMe(entity: Me): TSerializedMe {
    return new Me(entity);
  }

  private async getMe(id: string): Promise<Me> {
    const me = await this.meRepository.findOne({ where: { id } });
    if (!me) {
      throw new NotFoundException('Me not found');
    }
    return me;
  }
}
