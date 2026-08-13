import { Inject, Injectable } from '@nestjs/common';
import { Delivery } from '../../domain/entities/delivery.entity';
import { DELIVERY_REPOSITORY } from '../../domain/ports/delivery-repository.port';
import type { DeliveryRepositoryPort } from '../../domain/ports/delivery-repository.port';
import { DELIVERY_RECENCY_WARNING_DAYS } from '../../deliveries.tokens';

export interface DeliveryHistoryResult {
  deliveries: Delivery[];
  hasRecentDelivery: boolean;
  recencyWarningDays: number;
}

@Injectable()
export class GetDeliveryHistoryByPersonUseCase {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject(DELIVERY_RECENCY_WARNING_DAYS)
    private readonly recencyWarningDays: number,
  ) {}

  async execute(personId: string): Promise<DeliveryHistoryResult> {
    const deliveries = await this.deliveryRepository.findByPersonId(personId);
    const sorted = [...deliveries].sort(
      (a, b) => b.deliveredAt.getTime() - a.deliveredAt.getTime(),
    );

    const mostRecent = sorted[0];
    const hasRecentDelivery = mostRecent
      ? this.daysSince(mostRecent.deliveredAt) < this.recencyWarningDays
      : false;

    return { deliveries: sorted, hasRecentDelivery, recencyWarningDays: this.recencyWarningDays };
  }

  private daysSince(date: Date): number {
    const diffMs = Date.now() - date.getTime();
    return diffMs / (1000 * 60 * 60 * 24);
  }
}
