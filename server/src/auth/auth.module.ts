import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Auth0Strategy } from './strategies/Auth0.strategy';
import { JwtStrategy } from './strategies/JWT.strategy';
@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, Auth0Strategy, JwtStrategy],
})
export class AuthModule {}
