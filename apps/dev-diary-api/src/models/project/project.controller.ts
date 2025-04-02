import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Project } from '../../entities/project.entity';
import { ProjectRepository } from './project.repository';

@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectRepository: ProjectRepository) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  @Post()
  async create(@Body() project: Project): Promise<Project> {
    return await this.projectRepository.save(project);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() project: Project,
  ): Promise<Project> {
    const projectToUpdate = await this.projectRepository.findOne({
      where: { id },
    });
    if (!projectToUpdate) {
      throw new NotFoundException('Project not found');
    }
    return await this.projectRepository.mergeAndUpdate(
      projectToUpdate,
      project,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return await this.projectRepository.remove(project);
  }
}
