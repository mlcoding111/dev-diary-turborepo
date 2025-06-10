import { Module } from '@nestjs/common';
import { UserModule } from '@/models/user/user.module';
import { OAuthService } from './oauth.service';
import { IntegrationModule } from '@/models/integration/integration.module';

@Module({
  imports: [UserModule, IntegrationModule],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
