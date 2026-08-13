import { Delivery } from '../entities/delivery.entity';

export const DELIVERY_REPOSITORY = Symbol('DELIVERY_REPOSITORY');

export interface DeliveryRepositoryPort {
  save(delivery: Delivery): Promise<Delivery>;
  findByPersonId(personId: string): Promise<Delivery[]>;
}
