import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GithubService {
  async getClient(token: string): Promise<any> {
    const { Octokit } = await import('@octokit/rest');
    return new Octokit({ auth: token });
  }

  async getUserEmail(token: string, existingClient?: any): Promise<unknown> {
    const client = existingClient ?? (await this.getClient(token));
    const { data } = await client.request('GET /user/emails');
    const primaryEmail = data.filter((e) => e.primary === true)[0]?.email;

    if (!primaryEmail) {
      throw new UnauthorizedException('Github primary email not found');
    }

    return primaryEmail;
  }

  async getUserProfile(token: string, existingClient?: any): Promise<unknown> {
    const client = existingClient ?? (await this.getClient(token));
    const { data } = await client.request('GET /user');
    return data;
  }
}
