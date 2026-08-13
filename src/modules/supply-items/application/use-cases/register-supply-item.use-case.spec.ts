import { RegisterSupplyItemUseCase } from './register-supply-item.use-case';
import { EntityAlreadyExistsError } from '../../../../shared/kernel/domain-errors';
import type { SupplyItemRepositoryPort } from '../../domain/ports/supply-item-repository.port';
import { SupplyItem } from '../../domain/entities/supply-item.entity';

describe('RegisterSupplyItemUseCase', () => {
  let repository: jest.Mocked<SupplyItemRepositoryPort>;
  let useCase: RegisterSupplyItemUseCase;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findByIds: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(async (item: SupplyItem) => item),
    };
    useCase = new RegisterSupplyItemUseCase(repository);
  });

  it('registers a new item when the name is not taken', async () => {
    repository.findByName.mockResolvedValue(null);

    const item = await useCase.execute({ name: 'Ibuprofeno', category: 'MEDICINE', unit: 'caja' });

    expect(item.name).toBe('Ibuprofeno');
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects registration when an item with the same name already exists', async () => {
    repository.findByName.mockResolvedValue(
      SupplyItem.create({ id: 'existing-id', name: 'Ibuprofeno', category: 'MEDICINE', unit: 'caja' }),
    );

    await expect(
      useCase.execute({ name: 'ibuprofeno', category: 'MEDICINE', unit: 'caja' }),
    ).rejects.toBeInstanceOf(EntityAlreadyExistsError);
    expect(repository.save).not.toHaveBeenCalled();
  });
});
