import { Inject, Injectable } from '@nestjs/common';
import { SupplyItem } from '../../domain/entities/supply-item.entity';
import { SUPPLY_ITEM_REPOSITORY } from '../../domain/ports/supply-item-repository.port';
import type { SupplyItemRepositoryPort } from '../../domain/ports/supply-item-repository.port';

@Injectable()
export class ListSupplyItemsUseCase {
  constructor(
    @Inject(SUPPLY_ITEM_REPOSITORY)
    private readonly supplyItemRepository: SupplyItemRepositoryPort,
  ) {}

  execute(): Promise<SupplyItem[]> {
    return this.supplyItemRepository.findAll();
  }
}
