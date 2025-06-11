// src/modules/git/git-provider.resolver.ts
import { Injectable, NotFoundException } from '@nestjs/common';
// import { GithubProvider } from './git-provider';
// import { BitbucketProvider } from './git-provider';
import { GitProviderType } from '@repo/types/integrations';
import { GitProvider } from './git-provider';
import { GithubProvider } from './github.provider';
import { RequestContextService } from '../request/request-context.service';
import { TSerializedUser } from '@repo/types/schema';

const GIT_PROVIDERS_MAP = {
  [GitProviderType.GITHUB]: GithubProvider,
  // [GitProviderType.BITBUCKET]: BitbucketProvider,
};

// Might as well fetch the user's integration data here and do more validations
@Injectable()
export class GitResolverService {
  constructor(private readonly requestContextService: RequestContextService) {}

  resolve(
    provider: GitProviderType,
    providedUser?: TSerializedUser,
  ): GitProvider {
    const user = providedUser || this.requestContextService.get('user');
    console.log('The user', user);
    const GitProvider = GIT_PROVIDERS_MAP[provider];

    if (!GitProvider) {
      throw new NotFoundException(`Git provider "${provider}" not supported`);
    }

    return new GitProvider(user);
  }
}
