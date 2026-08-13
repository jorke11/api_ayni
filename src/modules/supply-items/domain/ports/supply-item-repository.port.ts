import { SupplyItem } from '../entities/supply-item.entity';

export const SUPPLY_ITEM_REPOSITORY = Symbol('SUPPLY_ITEM_REPOSITORY');

export interface SupplyItemRepositoryPort {
  findAll(): Promise<SupplyItem[]>;
  findByIds(ids: string[]): Promise<SupplyItem[]>;
  save(supplyItem: SupplyItem): Promise<SupplyItem>;
}
