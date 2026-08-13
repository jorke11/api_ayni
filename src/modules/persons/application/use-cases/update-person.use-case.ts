import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../../shared/kernel/domain-errors';
import { Person, VulnerabilityReason } from '../../domain/entities/person.entity';
import { PERSON_REPOSITORY } from '../../domain/ports/person-repository.port';
import type { PersonRepositoryPort } from '../../domain/ports/person-repository.port';

export interface UpdatePersonInput {
  id: string;
  fullName?: string;
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
export class UpdatePersonUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
  ) {}

  async execute(input: UpdatePersonInput): Promise<Person> {
    const existing = await this.personRepository.findById(input.id);
    if (!existing) {
      throw new EntityNotFoundError('No se encontró la persona a actualizar');
    }

    const snapshot = existing.toSnapshot();
    const updated = Person.create({
      ...snapshot,
      fullName: input.fullName ?? snapshot.fullName,
      birthDate: input.birthDate !== undefined ? input.birthDate : snapshot.birthDate,
      gender: input.gender !== undefined ? input.gender : snapshot.gender,
      phone: input.phone !== undefined ? input.phone : snapshot.phone,
      address: input.address !== undefined ? input.address : snapshot.address,
      householdSize: input.householdSize !== undefined ? input.householdSize : snapshot.householdSize,
      isVulnerable: input.isVulnerable ?? snapshot.isVulnerable,
      vulnerabilityReasons: input.vulnerabilityReasons ?? snapshot.vulnerabilityReasons,
      diseases: input.diseases ?? snapshot.diseases,
      notes: input.notes !== undefined ? input.notes : snapshot.notes,
      updatedAt: new Date(),
    });

    return this.personRepository.save(updated);
  }
}
