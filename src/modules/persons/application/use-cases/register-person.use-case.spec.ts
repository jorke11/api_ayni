import { RegisterPersonUseCase } from './register-person.use-case';
import { EntityAlreadyExistsError } from '../../../../shared/kernel/domain-errors';
import type { PersonRepositoryPort } from '../../domain/ports/person-repository.port';
import { Person } from '../../domain/entities/person.entity';

describe('RegisterPersonUseCase', () => {
  let repository: jest.Mocked<PersonRepositoryPort>;
  let useCase: RegisterPersonUseCase;

  beforeEach(() => {
    repository = {
      findByCedula: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(async (person: Person) => person),
    };
    useCase = new RegisterPersonUseCase(repository);
  });

  it('registers a new person when the cedula is not taken', async () => {
    repository.findByCedula.mockResolvedValue(null);

    const person = await useCase.execute({
      cedula: '0102030405',
      fullName: 'Ana Torres',
      isVulnerable: true,
      vulnerabilityReasons: ['ELDERLY'],
      diseases: ['diabetes'],
    });

    expect(person.cedula).toBe('0102030405');
    expect(person.isVulnerable).toBe(true);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects registration when the cedula already exists', async () => {
    repository.findByCedula.mockResolvedValue(
      Person.create({
        id: 'existing-id',
        cedula: '0102030405',
        fullName: 'Ana Torres',
        birthDate: null,
        gender: null,
        phone: null,
        address: null,
        householdSize: null,
        isVulnerable: false,
        vulnerabilityReasons: [],
        diseases: [],
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(
      useCase.execute({ cedula: '0102030405', fullName: 'Ana Torres' }),
    ).rejects.toBeInstanceOf(EntityAlreadyExistsError);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
