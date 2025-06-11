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
import { Integration } from '@/entities/integration.entity';
import { IntegrationRepository } from './integration.repository';
import { IntegrationService } from './integration.service';
import { Validate } from 'src/decorators/validation.decorator';
import { z } from 'zod';
import {
  PaginatedResult,
  type PaginationOptions,
} from '@/core/utils/service/base.service';
import {
  integrationSchemaSerialized,
  createIntegrationSchema,
  updateIntegrationSchema,
} from '@repo/types/schema';
import type { TSerializedIntegration } from '@repo/types/schema';
import { RequestContextService } from '@/modules/request/request-context.service';
import { OAuthList } from '@/config/oauth.config';
import { OAuthProviderType } from '@/types/auth';

@Controller('integrations')
@UseInterceptors(ClassSerializerInterceptor)
export class IntegrationController {
  private static readonly serializedIntegrationSchema =
    integrationSchemaSerialized as z.ZodSchema<TSerializedIntegration>;

  constructor(
    private readonly integrationRepository: IntegrationRepository,
    private readonly integrationService: IntegrationService,
    private readonly requestContextService: RequestContextService,
  ) {}

  @Validate({
    output: z.array(IntegrationController.serializedIntegrationSchema),
    pagination: true,
  })
  @Get()
  async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedResult<TSerializedIntegration>> {
    const user = this.requestContextService.get('user');
    return await this.integrationService.paginate({
      ...query,
      filter: {
        where: {
          user_id: {
            id: user.id,
          },
        },
      },
    });
  }

  @Validate({
    output: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        provider: z.nativeEnum(OAuthProviderType),
        available: z.boolean(),
      }),
    ),
  })
  @Get('available')
  getList(): typeof OAuthList {
    return OAuthList;
  }

  @Validate({
    output: IntegrationController.serializedIntegrationSchema,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TSerializedIntegration> {
    const integration = await this.getIntegration(id);
    return this.serializeIntegration(integration);
  }

  @Validate({
    output: IntegrationController.serializedIntegrationSchema,
    input: createIntegrationSchema,
  })
  @Post()
  async create(
    @Body() integration: Integration,
  ): Promise<TSerializedIntegration> {
    return await this.integrationRepository.save(integration);
  }

  @Validate({
    output: IntegrationController.serializedIntegrationSchema,
    input: updateIntegrationSchema,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() integration: Integration,
  ): Promise<TSerializedIntegration> {
    const integrationToUpdate = await this.getIntegration(id);
    return await this.integrationRepository.mergeAndUpdate(
      integrationToUpdate,
      integration,
    );
  }

  @Validate({
    output: IntegrationController.serializedIntegrationSchema,
  })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<TSerializedIntegration> {
    const integration = await this.getIntegration(id);
    return await this.integrationRepository.remove(integration);
  }

  private serializeIntegration(entity: Integration): TSerializedIntegration {
    return new Integration(entity);
  }

  private async getIntegration(id: string): Promise<Integration> {
    const integration = await this.integrationRepository.findOne({
      where: { id },
    });
    if (!integration) {
      throw new NotFoundException('Integration not found');
    }
    return integration;
  }
}
