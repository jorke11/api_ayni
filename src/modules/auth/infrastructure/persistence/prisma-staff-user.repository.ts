import { Injectable } from '@nestjs/common';
import { StaffUser as PrismaStaffUser } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { StaffUser } from '../../domain/entities/staff-user.entity';
import { StaffUserRepositoryPort } from '../../domain/ports/staff-user-repository.port';
import { StaffUserWriterPort } from '../../domain/ports/staff-user-writer.port';

@Injectable()
export class PrismaStaffUserRepository implements StaffUserRepositoryPort, StaffUserWriterPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByCedula(cedula: string): Promise<StaffUser | null> {
    const record = await this.prisma.staffUser.findUnique({ where: { cedula } });
    return record ? this.toDomain(record) : null;
  }

  async findById(id: string): Promise<StaffUser | null> {
    const record = await this.prisma.staffUser.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async save(staffUser: StaffUser): Promise<StaffUser> {
    const record = await this.prisma.staffUser.upsert({
      where: { id: staffUser.id },
      create: {
        id: staffUser.id,
        cedula: staffUser.cedula,
        fullName: staffUser.fullName,
        pinHash: staffUser.pinHash,
        role: staffUser.role,
        active: staffUser.active,
      },
      update: {
        fullName: staffUser.fullName,
        pinHash: staffUser.pinHash,
        role: staffUser.role,
        active: staffUser.active,
      },
    });
    return this.toDomain(record);
  }

  private toDomain(record: PrismaStaffUser): StaffUser {
    return StaffUser.create({
      id: record.id,
      cedula: record.cedula,
      fullName: record.fullName,
      pinHash: record.pinHash,
      role: record.role,
      active: record.active,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
