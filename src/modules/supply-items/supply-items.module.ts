import { Module } from '@nestjs/common';
import { ListSupplyItemsUseCase } from './application/use-cases/list-supply-items.use-case';
import { RegisterSupplyItemUseCase } from './application/use-cases/register-supply-item.use-case';
import { SUPPLY_ITEM_REPOSITORY } from './domain/ports/supply-item-repository.port';
import { PrismaSupplyItemRepository } from './infrastructure/persistence/prisma-supply-item.repository';
import { SupplyItemsController } from './infrastructure/http/supply-items.controller';

@Module({
  controllers: [SupplyItemsController],
  providers: [
    ListSupplyItemsUseCase,
    RegisterSupplyItemUseCase,
    { provide: SUPPLY_ITEM_REPOSITORY, useClass: PrismaSupplyItemRepository },
  ],
  exports: [SUPPLY_ITEM_REPOSITORY],
})
export class SupplyItemsModule {}
