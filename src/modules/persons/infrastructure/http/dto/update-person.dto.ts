import { PartialType, OmitType } from '@nestjs/mapped-types';
import { RegisterPersonDto } from './register-person.dto';

export class UpdatePersonDto extends PartialType(OmitType(RegisterPersonDto, ['cedula'] as const)) {}
