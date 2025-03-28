import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export const refreshJwtConfig = registerAs('refresh-jwt', () => ({
  secret: process.env.REFRESH_JWT_SECRET,
  expiresIn: process.env.REFRESH_JWT_SECRET_EXPIRES_IN,
}));
