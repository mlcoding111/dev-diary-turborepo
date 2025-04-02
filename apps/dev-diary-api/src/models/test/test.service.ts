import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { BaseService } from '@/core/utils/service/base.service';
import { Test } from '@/entities/test.entity';
import { TestRepository } from "./test.repository";

@Injectable()
export class TestService extends BaseService<Test> {
  constructor(
    private readonly testRepository: TestRepository
    ) {
        super(testRepository)
    }
    
}
