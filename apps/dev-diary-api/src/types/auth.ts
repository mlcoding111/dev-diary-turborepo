export enum OAuthProviderType {
  GOOGLE = 'google',
  GITHUB = 'github',
  BITBUCKET = 'bitbucket',
  GITLAB = 'gitlab',
  AZURE = 'azure',
}

export enum OAuthIntegrationType {
  GIT = 'git',
  OTHER = 'other',
}

export type TNormalizedOAuthProfile = {
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  username: string;
  profile_url: string;
};
