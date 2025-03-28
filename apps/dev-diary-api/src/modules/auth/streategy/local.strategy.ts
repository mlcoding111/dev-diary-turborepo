import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { User } from '@/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user: User | null = await this.authService.validateUser(
      email,
      password,
    );

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
