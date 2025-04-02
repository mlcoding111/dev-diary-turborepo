import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';
import { Project } from '@/entities/project.entity';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(private readonly projectRepository: ProjectRepository) {
    super(projectRepository);
  }
}
