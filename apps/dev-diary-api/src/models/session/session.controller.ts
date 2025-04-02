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
import {
  PaginatedResult,
  type PaginationOptions,
} from '@/core/utils/service/base.service';

@Controller('sessions')
@UseInterceptors(ClassSerializerInterceptor)
export class SessionController {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly sessionService: SessionService,
  ) {}

  @Get()
  async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedResult<Session>> {
    return await this.sessionService.paginate(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  @Post()
  async create(@Body() session: Session): Promise<Session> {
    return await this.sessionRepository.save(session);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() session: Session,
  ): Promise<Session> {
    const sessionToUpdate = await this.sessionRepository.findOne({
      where: { id },
    });
    if (!sessionToUpdate) {
      throw new NotFoundException('Session not found');
    }
    return await this.sessionRepository.mergeAndUpdate(
      sessionToUpdate,
      session,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return await this.sessionRepository.remove(session);
  }
}
