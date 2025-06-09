import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitService } from './git.service';
import { GitController } from './git.controller';
import { GitResolverService } from '@/modules/git/git-resolver.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [GitService, GitResolverService],
  controllers: [GitController],
  exports: [GitService],
})
export class GitModule {}
