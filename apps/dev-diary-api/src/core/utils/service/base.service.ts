// Every service should extend this class

import { ObjectLiteral, Repository, FindOptionsWhere } from 'typeorm';
import { PaginationResult } from './pagination';
import { BadRequestException } from '@nestjs/common';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class BaseService<T extends ObjectLiteral> {
  constructor(private readonly repository?: Repository<T>) {}

  /**
   * Paginate results from the repository
   * @param options Pagination options including page, limit, sorting, and filtering
   * @returns Paginated result with data and metadata
   */
  async paginate(options: PaginationOptions = {}): Promise<PaginatedResult<T>> {
    if (!this.repository)
      throw new BadRequestException('Repository not defined');
    const {
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = 'DESC',
      filter = {},
    } = options;

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build query options
    const queryOptions: any = {
      skip,
      take: limit,
      where: filter as FindOptionsWhere<T>,
    };

    // Add optional sorting
    if (sortBy) {
      queryOptions.order = { [sortBy]: sortOrder };
    }

    // Get data and count in parallel for efficiency
    const [data, total] = await Promise.all([
      this.repository.find(queryOptions),
      this.repository.count({ where: filter as FindOptionsWhere<T> }),
    ]);

    // Calculate metadata
    const totalPages = Math.ceil(total / limit);
    const newData = new PaginationResult(data, {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    });
    return newData;
  }
}
