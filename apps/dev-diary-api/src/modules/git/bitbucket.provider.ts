// src/modules/git/providers/bitbucket.provider.ts
import { TSerializedUser } from '@repo/types/schema';
import { GitProvider } from './git-provider';
import { GitProviderType } from '@repo/types/integrations';
import { Integration } from '@/entities/integration.entity';
import axios, { AxiosInstance } from 'axios';

export class BitbucketProvider extends GitProvider {
  public provider = GitProviderType.BITBUCKET;
  private baseUrl = 'https://api.bitbucket.org/2.0';

  private getClient(): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getUserProfile(): Promise<any> {
    const client = this.getClient();
    const { data } = await client.get('/user');
    return data;
  }

  async getCommits(repoSlug: string): Promise<any> {
    const client = this.getClient();
    const { data: user } = await this.getUserProfile();
    const username = user.username;

    const { data } = await client.get(
      `/repositories/${username}/${repoSlug}/commits`
    );
    return data;
  }

  async getRepositories(): Promise<any> {
    const client = this.getClient();
    const { data } = await client.get('/repositories?role=member');
    return data;
  }

  async getRepositoryCount(): Promise<number> {
    const client = this.getClient();
    const { data } = await client.get('/repositories?role=member&pagelen=1');
    return data?.size ?? 0;
  }

  async getUserEmail(): Promise<any> {
    const client = this.getClient();
    const { data } = await client.get('/user/emails');
    const primary = data.values.find((email: any) => email.is_primary);
    return primary?.email;
  }

  async getIntegrationData(): Promise<any> {
    return this.getUserProfile();
  }
}
