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
import { UserService } from '../user/user.service';
import { User } from '@/entities/user.entity';
import { capitalizeFirstLetter, capitalizeFirstLetterOfEachWord } from '@/core/utils/string';

@Controller('integrations')
@UseInterceptors(ClassSerializerInterceptor)
export class IntegrationController {
  private static readonly serializedIntegrationSchema =
    integrationSchemaSerialized as z.ZodSchema<TSerializedIntegration>;

  constructor(
    private readonly integrationRepository: IntegrationRepository,
    private readonly integrationService: IntegrationService,
    private readonly requestContextService: RequestContextService,
    private readonly userService: UserService,
  ) {}

  @Validate({
    output: z.array(IntegrationController.serializedIntegrationSchema),
    pagination: true,
    bypass: true,
  })
  @Get()
  async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedResult<TSerializedIntegration>> {
    const user = this.requestContextService.get('user');
    return await this.integrationService.paginate({
      ...query,
      filter: {
        user_id: user.id,
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
    bypass: true,
  })
  @Get('formatted')
  async getFormattedList(): Promise<any[]> {
    const user: User = this.requestContextService.get('user');
    const integrations = await this.userService.getAllIntegrations(user);
    const availableProviders = OAuthList.filter(
      (item) => item.available && item.provider !== OAuthProviderType.GOOGLE,
    );

    const formattedList = availableProviders.map((item) => {
      const integration = integrations.find(
        (integration) => integration.provider === item.provider,
      );
      return {
        title: capitalizeFirstLetterOfEachWord(item.title),
        description: item.description,
        is_active: integration ? true : false,
        connection_url: `${process.env.API_URL}/auth/${item.provider}`,
        ...integration,
      };
    });

    return formattedList;
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
