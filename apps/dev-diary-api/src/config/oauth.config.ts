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
    description: 'Connect your GitHub account to your Dev Diary account',
    provider: OAuthProviderType.GITHUB,
    available: true,
  },
  {
    title: OAuthProviderType.GOOGLE,
    description: 'Connect your Google account to your Dev Diary account',
    provider: OAuthProviderType.GOOGLE,
    available: true,
  },
  {
    title: OAuthProviderType.BITBUCKET,
    description: 'Connect your Bitbucket account to your Dev Diary account',
    provider: OAuthProviderType.BITBUCKET,
    available: true,
  },
];

export const OAuthSettings: Record<string, any> = {
  webhook: true,
  auto_sync: true,
  notifications: true,
};
