import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EntityAlreadyExistsError } from '../../../../shared/kernel/domain-errors';
import { SupplyCategory, SupplyItem } from '../../domain/entities/supply-item.entity';
import { SUPPLY_ITEM_REPOSITORY } from '../../domain/ports/supply-item-repository.port';
import type { SupplyItemRepositoryPort } from '../../domain/ports/supply-item-repository.port';

export interface RegisterSupplyItemInput {
  name: string;
  category: SupplyCategory;
  unit: string;
}

@Injectable()
export class RegisterSupplyItemUseCase {
  constructor(
    @Inject(SUPPLY_ITEM_REPOSITORY)
    private readonly supplyItemRepository: SupplyItemRepositoryPort,
  ) {}

  async execute(input: RegisterSupplyItemInput): Promise<SupplyItem> {
    const existing = await this.supplyItemRepository.findByName(input.name);
    if (existing) {
      throw new EntityAlreadyExistsError('Ya existe un artículo con este nombre en el catálogo');
    }

    const supplyItem = SupplyItem.create({
      id: randomUUID(),
      name: input.name,
      category: input.category,
      unit: input.unit,
    });
    return this.supplyItemRepository.save(supplyItem);
  }
}
