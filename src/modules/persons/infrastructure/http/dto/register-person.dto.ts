import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { VulnerabilityReason } from '../../../domain/entities/person.entity';

const VULNERABILITY_REASONS: VulnerabilityReason[] = [
  'ELDERLY',
  'PREGNANT',
  'DISABILITY',
  'MINOR',
  'CHRONIC_ILLNESS',
  'OTHER',
];

export class RegisterPersonDto {
  @IsString()
  @Length(5, 15)
  cedula: string;

  @IsString()
  @Length(3, 150)
  fullName: string;

  @IsOptional()
  @IsISO8601()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  householdSize?: number;

  @IsOptional()
  @IsBoolean()
  isVulnerable?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsIn(VULNERABILITY_REASONS, { each: true })
  vulnerabilityReasons?: VulnerabilityReason[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  diseases?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
