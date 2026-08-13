import { Injectable } from '@nestjs/common';
import { SupplyItem as PrismaSupplyItem } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { SupplyItem } from '../../domain/entities/supply-item.entity';
import { SupplyItemRepositoryPort } from '../../domain/ports/supply-item-repository.port';

@Injectable()
export class PrismaSupplyItemRepository implements SupplyItemRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SupplyItem[]> {
    const records = await this.prisma.supplyItem.findMany({ orderBy: { name: 'asc' } });
    return records.map((record) => this.toDomain(record));
  }

  async findByIds(ids: string[]): Promise<SupplyItem[]> {
    const records = await this.prisma.supplyItem.findMany({ where: { id: { in: ids } } });
    return records.map((record) => this.toDomain(record));
  }

  async findByName(name: string): Promise<SupplyItem | null> {
    const record = await this.prisma.supplyItem.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    return record ? this.toDomain(record) : null;
  }

  async save(supplyItem: SupplyItem): Promise<SupplyItem> {
    const snapshot = supplyItem.toSnapshot();
    const record = await this.prisma.supplyItem.upsert({
      where: { id: snapshot.id },
      create: snapshot,
      update: { name: snapshot.name, category: snapshot.category, unit: snapshot.unit },
    });
    return this.toDomain(record);
  }

  private toDomain(record: PrismaSupplyItem): SupplyItem {
    return SupplyItem.create({
      id: record.id,
      name: record.name,
      category: record.category,
      unit: record.unit,
    });
  }
}
