import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EntityNotFoundError } from '../../../../shared/kernel/domain-errors';
import { Delivery } from '../../domain/entities/delivery.entity';
import { DELIVERY_REPOSITORY } from '../../domain/ports/delivery-repository.port';
import type { DeliveryRepositoryPort } from '../../domain/ports/delivery-repository.port';
import { PERSON_REPOSITORY } from '../../../persons/domain/ports/person-repository.port';
import type { PersonRepositoryPort } from '../../../persons/domain/ports/person-repository.port';
import { SUPPLY_ITEM_REPOSITORY } from '../../../supply-items/domain/ports/supply-item-repository.port';
import type { SupplyItemRepositoryPort } from '../../../supply-items/domain/ports/supply-item-repository.port';

export interface RegisterDeliveryInput {
  personId: string;
  staffUserId: string;
  items: { supplyItemId: string; quantity: number }[];
  notes?: string | null;
}

@Injectable()
export class RegisterDeliveryUseCase {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
    @Inject(SUPPLY_ITEM_REPOSITORY)
    private readonly supplyItemRepository: SupplyItemRepositoryPort,
  ) {}

  async execute(input: RegisterDeliveryInput): Promise<Delivery> {
    const person = await this.personRepository.findById(input.personId);
    if (!person) {
      throw new EntityNotFoundError('No se encontró la persona para registrar la entrega');
    }

    const supplyItems = await this.supplyItemRepository.findByIds(
      input.items.map((item) => item.supplyItemId),
    );
    if (supplyItems.length !== new Set(input.items.map((item) => item.supplyItemId)).size) {
      throw new EntityNotFoundError('Uno o más artículos del catálogo no existen');
    }

    const delivery = Delivery.create({
      id: randomUUID(),
      personId: input.personId,
      staffUserId: input.staffUserId,
      deliveredAt: new Date(),
      items: input.items,
      notes: input.notes ?? null,
      createdAt: new Date(),
    });

    return this.deliveryRepository.save(delivery);
  }
}
