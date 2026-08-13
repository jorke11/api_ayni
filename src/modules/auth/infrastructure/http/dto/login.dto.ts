import { IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @Length(5, 15)
  cedula: string;

  @IsString()
  @Length(4, 8)
  pin: string;
}
