import { registerAs } from '@nestjs/config';

export const bitbucketOAuthConfig = registerAs('bitbucketOAuth', () => ({
  clientId: process.env.BITBUCKET_CLIENT_ID,
  clientSecret: process.env.BITBUCKET_SECRET,
  callbackUrl: process.env.BITBUCKET_CALLBACK_URL,
}));
