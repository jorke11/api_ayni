import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { RegisterDeliveryUseCase } from '../../application/use-cases/register-delivery.use-case';
import { GetDeliveryHistoryByPersonUseCase } from '../../application/use-cases/get-delivery-history-by-person.use-case';
import { EntityNotFoundError } from '../../../../shared/kernel/domain-errors';
import { RegisterDeliveryDto } from './dto/register-delivery.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/security/jwt-auth.guard';
import { CurrentStaff } from '../../../auth/infrastructure/security/current-staff.decorator';
import type { AuthenticatedStaff } from '../../../auth/infrastructure/security/jwt.strategy';

@Controller('deliveries')
@UseGuards(JwtAuthGuard)
export class DeliveriesController {
  constructor(
    private readonly registerDeliveryUseCase: RegisterDeliveryUseCase,
    private readonly getDeliveryHistoryByPersonUseCase: GetDeliveryHistoryByPersonUseCase,
  ) {}

  @Post()
  async register(@Body() dto: RegisterDeliveryDto, @CurrentStaff() staff: AuthenticatedStaff) {
    try {
      const delivery = await this.registerDeliveryUseCase.execute({
        personId: dto.personId,
        staffUserId: staff.id,
        items: dto.items,
        notes: dto.notes,
      });
      return delivery.toSnapshot();
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('by-person/:personId')
  async historyByPerson(@Param('personId') personId: string) {
    const result = await this.getDeliveryHistoryByPersonUseCase.execute(personId);
    return {
      deliveries: result.deliveries.map((delivery) => delivery.toSnapshot()),
      hasRecentDelivery: result.hasRecentDelivery,
      recencyWarningDays: result.recencyWarningDays,
    };
  }
}
