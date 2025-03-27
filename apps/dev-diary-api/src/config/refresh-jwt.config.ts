import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const refreshJwtConfig = registerAs(
  'refresh-jwt',
  (): JwtModuleOptions => ({
    secret: process.env.REFRESH_JWT_SECRET,
    signOptions: { expiresIn: process.env.REFRESH_JWT_SECRET_EXPIRES_IN },
  }),
);
