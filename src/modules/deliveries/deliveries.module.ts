import { Module } from '@nestjs/common';
import { RegisterDeliveryUseCase } from './application/use-cases/register-delivery.use-case';
import { GetDeliveryHistoryByPersonUseCase } from './application/use-cases/get-delivery-history-by-person.use-case';
import { DELIVERY_REPOSITORY } from './domain/ports/delivery-repository.port';
import { PrismaDeliveryRepository } from './infrastructure/persistence/prisma-delivery.repository';
import { DeliveriesController } from './infrastructure/http/deliveries.controller';
import { DELIVERY_RECENCY_WARNING_DAYS } from './deliveries.tokens';
import { PersonsModule } from '../persons/persons.module';
import { SupplyItemsModule } from '../supply-items/supply-items.module';

@Module({
  imports: [PersonsModule, SupplyItemsModule],
  controllers: [DeliveriesController],
  providers: [
    RegisterDeliveryUseCase,
    GetDeliveryHistoryByPersonUseCase,
    { provide: DELIVERY_REPOSITORY, useClass: PrismaDeliveryRepository },
    {
      provide: DELIVERY_RECENCY_WARNING_DAYS,
      useFactory: () => Number(process.env.DELIVERY_RECENCY_WARNING_DAYS ?? 7),
    },
  ],
})
export class DeliveriesModule {}
