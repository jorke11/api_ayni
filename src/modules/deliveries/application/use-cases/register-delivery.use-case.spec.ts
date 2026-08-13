import { RegisterDeliveryUseCase } from './register-delivery.use-case';
import { EntityNotFoundError } from '../../../../shared/kernel/domain-errors';
import type { DeliveryRepositoryPort } from '../../domain/ports/delivery-repository.port';
import type { PersonRepositoryPort } from '../../../persons/domain/ports/person-repository.port';
import type { SupplyItemRepositoryPort } from '../../../supply-items/domain/ports/supply-item-repository.port';
import { Delivery } from '../../domain/entities/delivery.entity';
import { Person } from '../../../persons/domain/entities/person.entity';
import { SupplyItem } from '../../../supply-items/domain/entities/supply-item.entity';

const buildPerson = () =>
  Person.create({
    id: 'person-1',
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
  });

const buildSupplyItem = (id: string) =>
  SupplyItem.create({ id, name: 'Arroz', category: 'FOOD', unit: 'kg' });

describe('RegisterDeliveryUseCase', () => {
  let deliveryRepository: jest.Mocked<DeliveryRepositoryPort>;
  let personRepository: jest.Mocked<PersonRepositoryPort>;
  let supplyItemRepository: jest.Mocked<SupplyItemRepositoryPort>;
  let useCase: RegisterDeliveryUseCase;

  beforeEach(() => {
    deliveryRepository = {
      save: jest.fn(async (delivery: Delivery) => delivery),
      findByPersonId: jest.fn(),
    };
    personRepository = {
      findByCedula: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    supplyItemRepository = {
      findAll: jest.fn(),
      findByIds: jest.fn(),
      save: jest.fn(),
    };
    useCase = new RegisterDeliveryUseCase(deliveryRepository, personRepository, supplyItemRepository);
  });

  it('registers a delivery when the person and items exist', async () => {
    personRepository.findById.mockResolvedValue(buildPerson());
    supplyItemRepository.findByIds.mockResolvedValue([buildSupplyItem('item-1')]);

    const delivery = await useCase.execute({
      personId: 'person-1',
      staffUserId: 'staff-1',
      items: [{ supplyItemId: 'item-1', quantity: 2 }],
    });

    expect(delivery.personId).toBe('person-1');
    expect(deliveryRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects the delivery when the person does not exist', async () => {
    personRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        personId: 'missing-person',
        staffUserId: 'staff-1',
        items: [{ supplyItemId: 'item-1', quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
    expect(deliveryRepository.save).not.toHaveBeenCalled();
  });

  it('rejects the delivery when a supply item does not exist in the catalog', async () => {
    personRepository.findById.mockResolvedValue(buildPerson());
    supplyItemRepository.findByIds.mockResolvedValue([]);

    await expect(
      useCase.execute({
        personId: 'person-1',
        staffUserId: 'staff-1',
        items: [{ supplyItemId: 'missing-item', quantity: 1 }],
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });
});
