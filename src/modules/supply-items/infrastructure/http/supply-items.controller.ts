import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ListSupplyItemsUseCase } from '../../application/use-cases/list-supply-items.use-case';
import { RegisterSupplyItemUseCase } from '../../application/use-cases/register-supply-item.use-case';
import { RegisterSupplyItemDto } from './dto/register-supply-item.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/security/roles.guard';
import { Roles } from '../../../auth/infrastructure/security/roles.decorator';

@Controller('supply-items')
@UseGuards(JwtAuthGuard)
export class SupplyItemsController {
  constructor(
    private readonly listSupplyItemsUseCase: ListSupplyItemsUseCase,
    private readonly registerSupplyItemUseCase: RegisterSupplyItemUseCase,
  ) {}

  @Get()
  async list() {
    const items = await this.listSupplyItemsUseCase.execute();
    return items.map((item) => item.toSnapshot());
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async register(@Body() dto: RegisterSupplyItemDto) {
    const item = await this.registerSupplyItemUseCase.execute(dto);
    return item.toSnapshot();
  }
}
