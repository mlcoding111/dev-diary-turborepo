// src/modules/github/github.module.ts
import { Module } from '@nestjs/common';
import { GitResolverService } from './git-resolver.service';

@Module({
  providers: [GitResolverService],
  exports: [GitResolverService],
})
export class GitResolverModule {}
