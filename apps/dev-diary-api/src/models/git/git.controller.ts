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
import { GitService } from './git.service';
import { Validate } from 'src/decorators/validation.decorator';
import { z } from 'zod';
import {
  PaginatedResult,
  type PaginationOptions,
} from '@/core/utils/service/base.service';
import { GitResolverService } from '@/modules/git/git-resolver.service';
import { GitProviderType } from '@repo/types/integrations';

@Controller('git')
@UseInterceptors(ClassSerializerInterceptor)
export class GitController {
  constructor(private readonly gitService: GitService) {}

  @Validate({
    bypass: true,
  })
  @Get('commits')
  async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedResult<any>> {
    const gitProvider = await this.gitService.resolveProvider();
    // const userProfile = await gitProvider.getUserProfile();
    const commits = await gitProvider.getCommits('my-turborepo');

    console.log('The commits are', commits);
    return commits;
    return await this.gitService.paginate(query);
  }
}
