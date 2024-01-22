import { Logger, Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Auth0Strategy } from './strategies/Auth0.strategy';
import { JwtStrategy } from './strategies/JWT.strategy';
import { UserModule } from '@server/user/user.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const JWT_SECRET = config.get('JWT_SECRET');
        const JWT_EXPIRES_IN = config.get('JWT_EXPIRES_IN');
        if (!JWT_SECRET) {
          Logger.error('JWT_SECRET is not set');
          throw new Error('JWT_SECRET is not set');
        }
        if (!JWT_EXPIRES_IN) {
          Logger.warn('JWT_EXPIRES_IN is not set, using default of 60s');
        }
        return {
          secret: JWT_SECRET,
          signOptions: { expiresIn: JWT_EXPIRES_IN || '60s' },
        };
      },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, Auth0Strategy, JwtStrategy],
})
export class AuthModule {}
