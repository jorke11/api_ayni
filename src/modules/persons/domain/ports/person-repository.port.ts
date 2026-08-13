import { Person } from '../entities/person.entity';

export const PERSON_REPOSITORY = Symbol('PERSON_REPOSITORY');

export interface PersonRepositoryPort {
  findByCedula(cedula: string): Promise<Person | null>;
  findById(id: string): Promise<Person | null>;
  save(person: Person): Promise<Person>;
}
