import { Injectable } from '@nestjs/common';
import { Delivery as PrismaDelivery, DeliveryItem as PrismaDeliveryItem } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Delivery } from '../../domain/entities/delivery.entity';
import { DeliveryRepositoryPort } from '../../domain/ports/delivery-repository.port';

type DeliveryWithItems = PrismaDelivery & { items: PrismaDeliveryItem[] };

@Injectable()
export class PrismaDeliveryRepository implements DeliveryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async save(delivery: Delivery): Promise<Delivery> {
    const snapshot = delivery.toSnapshot();
    const record = await this.prisma.delivery.create({
      data: {
        id: snapshot.id,
        personId: snapshot.personId,
        staffUserId: snapshot.staffUserId,
        deliveredAt: snapshot.deliveredAt,
        notes: snapshot.notes,
        items: {
          create: snapshot.items.map((item) => ({
            supplyItemId: item.supplyItemId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
    return this.toDomain(record);
  }

  async findByPersonId(personId: string): Promise<Delivery[]> {
    const records = await this.prisma.delivery.findMany({
      where: { personId },
      include: { items: true },
      orderBy: { deliveredAt: 'desc' },
    });
    return records.map((record) => this.toDomain(record));
  }

  private toDomain(record: DeliveryWithItems): Delivery {
    return Delivery.create({
      id: record.id,
      personId: record.personId,
      staffUserId: record.staffUserId,
      deliveredAt: record.deliveredAt,
      notes: record.notes,
      createdAt: record.createdAt,
      items: record.items.map((item) => ({
        supplyItemId: item.supplyItemId,
        quantity: item.quantity,
      })),
    });
  }
}
