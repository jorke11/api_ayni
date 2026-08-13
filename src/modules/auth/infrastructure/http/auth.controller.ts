import { Body, ConflictException, Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginStaffUseCase } from '../../application/use-cases/login-staff.use-case';
import { RegisterStaffUseCase } from '../../application/use-cases/register-staff.use-case';
import { EntityAlreadyExistsError, InvalidCredentialsError } from '../../../../shared/kernel/domain-errors';
import { LoginDto } from './dto/login.dto';
import { RegisterStaffDto } from './dto/register-staff.dto';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { RolesGuard } from '../security/roles.guard';
import { Roles } from '../security/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginStaffUseCase: LoginStaffUseCase,
    private readonly registerStaffUseCase: RegisterStaffUseCase,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.loginStaffUseCase.execute(dto);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Post('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async registerStaff(@Body() dto: RegisterStaffDto) {
    try {
      const staff = await this.registerStaffUseCase.execute(dto);
      return { id: staff.id, cedula: staff.cedula, fullName: staff.fullName, role: staff.role };
    } catch (error) {
      if (error instanceof EntityAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
