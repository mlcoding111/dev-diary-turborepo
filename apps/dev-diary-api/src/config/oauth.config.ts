import { OAuthProviderType } from '@/types/auth';
import { registerAs } from '@nestjs/config';

export const oauthConfig = registerAs('oauth', () => ({
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
  },
}));

export const OAuthList: {
  title: OAuthProviderType;
  description: string;
  provider: OAuthProviderType;
  available: boolean;
}[] = [
  {
    title: OAuthProviderType.GITHUB,
    description:
      'Connect your GitHub repositories for commit tracking and analytics',
    provider: OAuthProviderType.GITHUB,
    available: true,
  },
  {
    title: OAuthProviderType.GOOGLE,
    description:
      'Connect your Google account for seamless authentication and access to your Google Drive',
    provider: OAuthProviderType.GOOGLE,
    available: true,
  },
  {
    title: OAuthProviderType.BITBUCKET,
    description:
      'Connect your Bitbucket repositories for commit tracking and analytics',
    provider: OAuthProviderType.BITBUCKET,
    available: true,
  },
  {
    title: OAuthProviderType.GITLAB,
    description:
      'Connect your GitLab repositories for commit tracking and analytics',
    provider: OAuthProviderType.GITLAB,
    available: true,
  },
  {
    title: OAuthProviderType.AZURE,
    description:
      'Connect your Azure repositories for commit tracking and analytics',
    provider: OAuthProviderType.AZURE,
    available: true,
  },
];

export const OAuthSettings: Record<string, any> = {
  webhook: true,
  auto_sync: true,
  notifications: true,
};
