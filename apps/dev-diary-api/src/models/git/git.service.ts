import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@/core/utils/service/base.service';
import { TSerializedUser } from '@repo/types/schema';
import { GitProviderType } from '@repo/types/integrations';
import { GithubProvider } from '@/modules/git/github.provider';
import { GitProvider } from '@/modules/git/git-provider';
import { RequestContextService } from '@/modules/request/request-context.service';
import { IntegrationService } from '../integration/integration.service';
import { BitbucketProvider } from '@/modules/git/bitbucket.provider';
import { Integration } from '@/entities/integration.entity';

// TODO: Move this to shared types
type GitProviderConstructor = new (
  user: TSerializedUser,
  integration: Integration,
) => GitProvider;
// TODO: Move this to shared config file for git providers
const GIT_PROVIDERS_MAP: Record<GitProviderType, GitProviderConstructor> = {
  [GitProviderType.GITHUB]: GithubProvider,
  [GitProviderType.BITBUCKET]: BitbucketProvider,
};

@Injectable()
export class GitService extends BaseService<any> {
  constructor(
    private readonly requestContextService: RequestContextService,
    private readonly integrationService: IntegrationService,
  ) {
    super();
  }

  async resolveProvider(): Promise<GitProvider> {
    const user = this.requestContextService.get('user');
    const integration =
      await this.integrationService.getActiveIntegration(user);

    const GitProviderClass = GIT_PROVIDERS_MAP[integration.provider];

    if (!GitProviderClass) {
      throw new NotFoundException(
        `Git provider "${integration.provider}" not supported`,
      );
    }
    const instance: GitProvider = new GitProviderClass(user, integration);

    return instance;
  }
}
