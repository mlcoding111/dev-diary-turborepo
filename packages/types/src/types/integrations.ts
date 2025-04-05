export enum GitProviderType {
	GITHUB = "github",
	BITBUCKET = "bitbucket",
}

export type TIntegrationData = {
  [provider in GitProviderType]: TIntegrationDataProvider;
};

export type TIntegrationDataProvider = {
  token: string;
  provider: GitProviderType;
  username?: string;
}

export type TBitbucketIntegrationData = TIntegrationDataProvider & {
  provider: GitProviderType.BITBUCKET;
}
