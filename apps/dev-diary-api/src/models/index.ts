import { IntegrationModule } from './integration/integration.module';
import { GitModule } from './git/git.module';
import { MeModule } from './me/me.module';
import { UserModule } from './user/user.module';
import { OAuthModule } from '@/modules/auth/oauth/oauth.module';

export default [
  UserModule,
  MeModule,
  GitModule,
  IntegrationModule,
  OAuthModule,
];
