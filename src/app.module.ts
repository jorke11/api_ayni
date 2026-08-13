import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PersonsModule } from './modules/persons/persons.module';
import { SupplyItemsModule } from './modules/supply-items/supply-items.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';

@Module({
  imports: [PrismaModule, AuthModule, PersonsModule, SupplyItemsModule, DeliveriesModule],
  controllers: [AppController],
})
export class AppModule {}
