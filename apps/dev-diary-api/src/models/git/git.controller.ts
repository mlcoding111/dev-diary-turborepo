import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { GitService } from './git.service';
import { Validate } from 'src/decorators/validation.decorator';

@Controller('git')
@UseInterceptors(ClassSerializerInterceptor)
export class GitController {
  constructor(private readonly gitService: GitService) {}

  @Validate({
    bypass: true,
  })
  @Get('commits')
  async findAll(): Promise<any> {
    const gitProvider = await this.gitService.resolveProvider();
    const commits = await gitProvider.getCommits('my-turborepo');
    return commits;
  }

  @Validate({
    bypass: true,
  })
  @Get('repositories')
  async getRepositories(): Promise<any> {
    const gitProvider = await this.gitService.resolveProvider();
    const repositories = await gitProvider.getRepositories();
    return repositories;
  }

  @Validate({
    bypass: true,
  })
  @Get('repository-count')
  async getRepositoryCount(): Promise<any> {
    const gitProvider = await this.gitService.resolveProvider();
    const repositoryCount = await gitProvider.getRepositoryCount();
    return repositoryCount;
  }
}
