import { Injectable } from '@nestjs/common';
import { Person as PrismaPerson } from '@prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { Person, VulnerabilityReason } from '../../domain/entities/person.entity';
import { PersonRepositoryPort } from '../../domain/ports/person-repository.port';

@Injectable()
export class PrismaPersonRepository implements PersonRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByCedula(cedula: string): Promise<Person | null> {
    const record = await this.prisma.person.findUnique({ where: { cedula } });
    return record ? this.toDomain(record) : null;
  }

  async findById(id: string): Promise<Person | null> {
    const record = await this.prisma.person.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async save(person: Person): Promise<Person> {
    const snapshot = person.toSnapshot();
    const record = await this.prisma.person.upsert({
      where: { id: snapshot.id },
      create: {
        id: snapshot.id,
        cedula: snapshot.cedula,
        fullName: snapshot.fullName,
        birthDate: snapshot.birthDate,
        gender: snapshot.gender,
        phone: snapshot.phone,
        address: snapshot.address,
        householdSize: snapshot.householdSize,
        isVulnerable: snapshot.isVulnerable,
        vulnerabilityReasons: snapshot.vulnerabilityReasons,
        diseases: snapshot.diseases,
        notes: snapshot.notes,
      },
      update: {
        fullName: snapshot.fullName,
        birthDate: snapshot.birthDate,
        gender: snapshot.gender,
        phone: snapshot.phone,
        address: snapshot.address,
        householdSize: snapshot.householdSize,
        isVulnerable: snapshot.isVulnerable,
        vulnerabilityReasons: snapshot.vulnerabilityReasons,
        diseases: snapshot.diseases,
        notes: snapshot.notes,
      },
    });
    return this.toDomain(record);
  }

  private toDomain(record: PrismaPerson): Person {
    return Person.create({
      id: record.id,
      cedula: record.cedula,
      fullName: record.fullName,
      birthDate: record.birthDate,
      gender: record.gender,
      phone: record.phone,
      address: record.address,
      householdSize: record.householdSize,
      isVulnerable: record.isVulnerable,
      vulnerabilityReasons: record.vulnerabilityReasons as VulnerabilityReason[],
      diseases: record.diseases,
      notes: record.notes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
