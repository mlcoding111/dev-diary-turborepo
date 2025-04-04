export enum GitProviderType {
	GITHUB = "github",
	BITBUCKET = "bitbucket",
}

export interface IIntegrationData {
  token: string;
  provider: GitProviderType;
}

