import { IsIn, IsString, Length } from 'class-validator';
import type { SupplyCategory } from '../../../domain/entities/supply-item.entity';

const SUPPLY_CATEGORIES: SupplyCategory[] = ['MEDICINE', 'FOOD', 'CLOTHING', 'HYGIENE', 'OTHER'];

export class RegisterSupplyItemDto {
  @IsString()
  @Length(2, 120)
  name: string;

  @IsIn(SUPPLY_CATEGORIES)
  category: SupplyCategory;

  @IsString()
  @Length(1, 20)
  unit: string;
}
