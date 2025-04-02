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
import { Test } from '../../entities/test.entity';
import { TestRepository } from './test.repository';

@Controller('tests')
@UseInterceptors(ClassSerializerInterceptor)
export class TestController {
  constructor(
    private readonly testRepository: TestRepository,
  ) {}

  @Get()
  async findAll(): Promise<Test[]> {
    return await this.testRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Test> {
    const test = await this.testRepository.findOne({ where: { id } });
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return test;
  }

  @Post()
  async create(@Body() test: Test): Promise<Test> {
    return await this.testRepository.save(test);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() test: Test): Promise<Test> {
    const testToUpdate = await this.testRepository.findOne({ where: { id } });
    if (!testToUpdate) {
      throw new NotFoundException('Test not found');
    }
    return await this.testRepository.mergeAndUpdate(testToUpdate, test);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Test> {
    const test = await this.testRepository.findOne({ where: { id } });
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    return await this.testRepository.remove(test);
  }
}
