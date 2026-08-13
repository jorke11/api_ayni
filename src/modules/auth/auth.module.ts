import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginStaffUseCase } from './application/use-cases/login-staff.use-case';
import { RegisterStaffUseCase } from './application/use-cases/register-staff.use-case';
import { STAFF_USER_REPOSITORY } from './domain/ports/staff-user-repository.port';
import { STAFF_USER_WRITER } from './domain/ports/staff-user-writer.port';
import { TOKEN_ISSUER } from './domain/ports/token-issuer.port';
import { PrismaStaffUserRepository } from './infrastructure/persistence/prisma-staff-user.repository';
import { JwtTokenIssuer } from './infrastructure/security/jwt-token-issuer';
import { JwtStrategy } from './infrastructure/security/jwt.strategy';
import { AuthController } from './infrastructure/http/auth.controller';
import { PASSWORD_HASHER } from '../../shared/kernel/password-hasher.port';
import { BcryptPasswordHasher } from '../../shared/infrastructure/security/bcrypt-password-hasher';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change-this-secret-in-production',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '8h') as `${number}${'s' | 'm' | 'h' | 'd'}`,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginStaffUseCase,
    RegisterStaffUseCase,
    JwtStrategy,
    { provide: STAFF_USER_REPOSITORY, useClass: PrismaStaffUserRepository },
    { provide: STAFF_USER_WRITER, useClass: PrismaStaffUserRepository },
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuer },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
  ],
  exports: [STAFF_USER_REPOSITORY],
})
export class AuthModule {}
