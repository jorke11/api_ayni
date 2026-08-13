import { GetDeliveryHistoryByPersonUseCase } from './get-delivery-history-by-person.use-case';
import type { DeliveryRepositoryPort } from '../../domain/ports/delivery-repository.port';
import { Delivery } from '../../domain/entities/delivery.entity';

const buildDelivery = (deliveredAt: Date) =>
  Delivery.create({
    id: `delivery-${deliveredAt.getTime()}`,
    personId: 'person-1',
    staffUserId: 'staff-1',
    deliveredAt,
    items: [{ supplyItemId: 'item-1', quantity: 1 }],
    notes: null,
    createdAt: deliveredAt,
  });

describe('GetDeliveryHistoryByPersonUseCase', () => {
  let deliveryRepository: jest.Mocked<DeliveryRepositoryPort>;

  beforeEach(() => {
    deliveryRepository = { save: jest.fn(), findByPersonId: jest.fn() };
  });

  it('flags a recent delivery within the warning window', async () => {
    const yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    deliveryRepository.findByPersonId.mockResolvedValue([buildDelivery(yesterday)]);
    const useCase = new GetDeliveryHistoryByPersonUseCase(deliveryRepository, 7);

    const result = await useCase.execute('person-1');

    expect(result.hasRecentDelivery).toBe(true);
    expect(result.deliveries).toHaveLength(1);
  });

  it('does not flag a delivery older than the warning window', async () => {
    const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    deliveryRepository.findByPersonId.mockResolvedValue([buildDelivery(twentyDaysAgo)]);
    const useCase = new GetDeliveryHistoryByPersonUseCase(deliveryRepository, 7);

    const result = await useCase.execute('person-1');

    expect(result.hasRecentDelivery).toBe(false);
  });

  it('returns no warning when there is no delivery history', async () => {
    deliveryRepository.findByPersonId.mockResolvedValue([]);
    const useCase = new GetDeliveryHistoryByPersonUseCase(deliveryRepository, 7);

    const result = await useCase.execute('person-1');

    expect(result.hasRecentDelivery).toBe(false);
    expect(result.deliveries).toHaveLength(0);
  });
});
