import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../../shared/kernel/domain-errors';
import { Person } from '../../domain/entities/person.entity';
import { PERSON_REPOSITORY } from '../../domain/ports/person-repository.port';
import type { PersonRepositoryPort } from '../../domain/ports/person-repository.port';

@Injectable()
export class FindPersonByCedulaUseCase {
  constructor(
    @Inject(PERSON_REPOSITORY)
    private readonly personRepository: PersonRepositoryPort,
  ) {}

  async execute(cedula: string): Promise<Person> {
    const person = await this.personRepository.findByCedula(cedula);
    if (!person) {
      throw new EntityNotFoundError('No se encontró ninguna persona con esta cédula');
    }
    return person;
  }
}
