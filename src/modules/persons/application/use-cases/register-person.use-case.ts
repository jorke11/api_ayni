import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EntityAlreadyExistsError } from '../../../../shared/kernel/domain-errors';
import { Person, VulnerabilityReason } from '../../domain/entities/person.entity';
import { PERSON_REPOSITORY } from '../../domain/ports/person-repository.port';
import type { PersonRepositoryPort } from '../../domain/ports/person-repository.port';

export interface RegisterPersonInput {
  cedula: string;
  fullName: string;
  birthDate?: Date | null;
  gender?: string | null;
  phone?: string | null;
  address?: string | null;
  householdSize?: number | null;
  isVulnerable?: boolean;
  vulnerabilityReasons?: VulnerabilityReason[];
  diseases?: string[];
  notes?: string | null;
}

@Injectable()
export class RegisterPersonUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
  ) {}

  async execute(input: RegisterPersonInput): Promise<Person> {
    const existing = await this.personRepository.findByCedula(input.cedula);
    if (existing) {
      throw new EntityAlreadyExistsError('Ya existe una persona registrada con esta cédula');
    }

    const now = new Date();
    const person = Person.create({
      id: randomUUID(),
      cedula: input.cedula,
      fullName: input.fullName,
      birthDate: input.birthDate ?? null,
      gender: input.gender ?? null,
      phone: input.phone ?? null,
      address: input.address ?? null,
      householdSize: input.householdSize ?? null,
      isVulnerable: input.isVulnerable ?? false,
      vulnerabilityReasons: input.vulnerabilityReasons ?? [],
      diseases: input.diseases ?? [],
      notes: input.notes ?? null,
      createdAt: now,
      updatedAt: now,
    });

    return this.personRepository.save(person);
  }
}
