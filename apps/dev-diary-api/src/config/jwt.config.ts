import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
}));
