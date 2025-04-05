// src/modules/git/providers/github.provider.ts
import { TSerializedUser } from '@repo/types/schema';
import { GitProvider } from './git-provider';
import { GitProviderType } from '@repo/types/integrations';
// https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28
export class GithubProvider extends GitProvider {
  public provider = GitProviderType.GITHUB;

  constructor(user: TSerializedUser) {
    super(user, GitProviderType.GITHUB);
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
      `GET /repos/mlcoding111/${repo}/commits`,
      // {
      //   since: '2025-04-02T00:00:00Z',
      // },
    );
    return data;
  }

  async getRepositories(): Promise<any> {
    const client = await this.getClient();
    const { data } = await client.request('GET /user/repos');
    return data;
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
}
