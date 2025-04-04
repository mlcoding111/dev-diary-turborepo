import { registerAs } from '@nestjs/config';

export const githubOAuthConfig = registerAs('githubOAuth', () => ({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackUrl: process.env.GITHUB_CALLBACK_URL,
}));
