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
import { Session } from '@/entities/session.entity';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';
import { Validate } from 'src/decorators/validation.decorator';
import { z } from 'zod';
import {
  PaginatedResult,
  type PaginationOptions,
} from '@/core/utils/service/base.service';
import {
  sessionSchemaSerialized,
  type TSerializedSession,
  createSessionSchema,
  updateSessionSchema,
} from '@repo/types/schema';
@Controller('sessions')
@UseInterceptors(ClassSerializerInterceptor)
export class SessionController {
  private static readonly serializedSessionSchema =
    sessionSchemaSerialized as z.ZodSchema<TSerializedSession>;

  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly sessionService: SessionService,
  ) {}

  @Validate({
    output: z.array(SessionController.serializedSessionSchema),
    pagination: true,
  })
  @Get()
  async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedResult<TSerializedSession>> {
    return await this.sessionService.paginate(query);
  }

  @Validate({
    output: SessionController.serializedSessionSchema,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TSerializedSession> {
    const session = await this.getSession(id);
    return this.serializeSession(session);
  }

  @Validate({
    output: SessionController.serializedSessionSchema,
    input: createSessionSchema,
  })
  @Post()
  async create(@Body() session: Session): Promise<TSerializedSession> {
    return await this.sessionRepository.save(session);
  }

  @Validate({
    output: SessionController.serializedSessionSchema,
    input: updateSessionSchema,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() session: Session,
  ): Promise<TSerializedSession> {
    const sessionToUpdate = await this.getSession(id);
    return await this.sessionRepository.mergeAndUpdate(
      sessionToUpdate,
      session,
    );
  }

  @Validate({
    output: SessionController.serializedSessionSchema,
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<TSerializedSession> {
    const session = await this.getSession(id);
    return await this.sessionRepository.remove(session);
  }

  private serializeSession(entity: Session): TSerializedSession {
    return new Session(entity);
  }

  private async getSession(id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }
}
