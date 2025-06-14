import { Integration } from '@/entities/integration.entity';
import { GitProviderType } from '@repo/types/integrations';
import { TSerializedUser } from '@repo/types/schema';

export abstract class GitProvider {
  private readonly user: TSerializedUser;
  public readonly integration: Integration;
  public readonly token: string;
  abstract provider: GitProviderType;
  abstract getUserProfile(): Promise<any>;
  abstract getUserEmail(): Promise<any>;
  abstract getRepositories(): Promise<any>;
  abstract getCommits(repo: string): Promise<any>;
  abstract getRepositoryCount(): Promise<number>;

  constructor(user: TSerializedUser, integration: Integration) {
    this.user = user;
    this.integration = integration;
    this.token = integration.access_token;
  }
}
