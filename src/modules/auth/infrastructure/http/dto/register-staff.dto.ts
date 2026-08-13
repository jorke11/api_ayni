import { IsIn, IsString, Length } from 'class-validator';
import type { StaffRole } from '../../../domain/entities/staff-user.entity';

export class RegisterStaffDto {
  @IsString()
  @Length(5, 15)
  cedula: string;

  @IsString()
  @Length(3, 120)
  fullName: string;

  @IsString()
  @Length(4, 8)
  pin: string;

  @IsIn(['ADMIN', 'OPERATOR'])
  role: StaffRole;
}
