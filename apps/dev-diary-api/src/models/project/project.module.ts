import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectRepository } from './project.repository';
import { ProjectSubscriber } from './project.subscriber';
import { ProjectListener } from './project.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  providers: [
    ProjectService,
    ProjectRepository,
    ProjectSubscriber,
    ProjectListener,
  ],
  controllers: [ProjectController],
  exports: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
