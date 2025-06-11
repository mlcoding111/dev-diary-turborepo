export enum OAuthProviderType {
  GOOGLE = 'google',
  GITHUB = 'github',
  BITBUCKET = 'bitbucket',
}

export type TNormalizedOAuthProfile = {
  email: string;
  first_name: string;
  last_name: string;
};
