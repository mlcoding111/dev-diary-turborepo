import { GitProviderType } from '@repo/types/integrations';
import { IIntegrationData } from '@repo/types/integrations';
import { TSerializedUser } from '@repo/types/schema';

export abstract class GitProvider {
  private readonly user: TSerializedUser;
  private readonly integrationData: IIntegrationData;
  public readonly token: string;
  abstract provider: GitProviderType;
  abstract getUserProfile(): Promise<any>;
  abstract getUserEmail(): Promise<any>;
  abstract getRepositories(): Promise<any>;
  abstract getCommits(repo: string): Promise<any>;

  constructor(user: TSerializedUser, provider: GitProviderType) {
    this.user = user;
    const integrationData = this.getIntegrationJsonData(user, provider);
    this.integrationData = integrationData;
    this.token = integrationData.token;
  }

  private getIntegrationJsonData(
    user: TSerializedUser,
    provider: GitProviderType,
  ): IIntegrationData {
    const integrationData = user.integration_data?.[provider] || null;

    if (!integrationData) {
      throw new Error('Integration data not found');
    }

    return integrationData;
  }
}
