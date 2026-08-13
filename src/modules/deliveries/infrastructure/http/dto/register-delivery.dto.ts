import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class DeliveryItemDto {
  @IsString()
  supplyItemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class RegisterDeliveryDto {
  @IsString()
  personId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DeliveryItemDto)
  items: DeliveryItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
