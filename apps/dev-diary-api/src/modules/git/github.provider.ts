// src/modules/git/providers/github.provider.ts
import { TSerializedUser } from '@repo/types/schema';
import { GitProvider } from './git-provider';
import { GitProviderType } from '@repo/types/integrations';
import { Integration } from '@/entities/integration.entity';
// https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28
export class GithubProvider extends GitProvider {
  public provider = GitProviderType.GITHUB;

  constructor(user: TSerializedUser, integration: Integration) {
    super(user, integration);
  }
  private async getClient(): Promise<any> {
    const { Octokit } = await import('@octokit/rest');
    return new Octokit({ auth: this.token });
  }

  async getUserProfile(): Promise<any> {
    const client = await this.getClient();
    const { data } = await client.request('GET /user');
    return data;
  }
  // since string
  // Only show results that were last updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Due to limitations of Git, timestamps must be between 1970-01-01 and 2099-12-31 (inclusive) or unexpected results may be returned.
  async getCommits(repo: string): Promise<any> {
    const client = await this.getClient();
    const { data } = await client.request(
      `GET /repos/${this.integration.username}/${repo}/commits`,
      {
        sort: 'committer-date',
        direction: 'desc',
      },
    );
    return data;
  }

  async getRepositories(params?: Record<string, any>): Promise<any> {
    const client = await this.getClient();
    const { data, headers } = await client.request('GET /user/repos', {
      per_page: 100,
      visibility: 'all',
      ...params,
    });
    return data;
  }

  async getRepositoryCount(): Promise<number> {
    const client = await this.getClient();
    const { headers } = await client.request('GET /user/repos', {
      per_page: 1,
      visibility: 'all',
    });
    const totalCount =
      Number(headers['x-total-count']) ||
      this.estimateFromLinkHeader(headers.link || '');
    return totalCount || 0;
  }
  async getUserEmail(): Promise<any> {
    const client = await this.getClient();
    const { data } = await client.request('GET /user/emails');
    return data;
  }

  async getIntegrationData(): Promise<any> {
    const client = await this.getClient();
    const { data } = await client.request('GET /user');
    return data;
  }

  //
  private estimateFromLinkHeader(linkHeader?: string): number | null {
    if (!linkHeader) return null;

    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    if (match && match[1]) {
      return parseInt(match[1], 10); // This gives last page number
    }

    return null;
  }
}
