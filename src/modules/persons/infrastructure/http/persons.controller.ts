import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterPersonUseCase } from '../../application/use-cases/register-person.use-case';
import { FindPersonByCedulaUseCase } from '../../application/use-cases/find-person-by-cedula.use-case';
import { UpdatePersonUseCase } from '../../application/use-cases/update-person.use-case';
import { EntityAlreadyExistsError, EntityNotFoundError } from '../../../../shared/kernel/domain-errors';
import { RegisterPersonDto } from './dto/register-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/security/jwt-auth.guard';
import { Person } from '../../domain/entities/person.entity';

@Controller('persons')
@UseGuards(JwtAuthGuard)
export class PersonsController {
  constructor(
    private readonly registerPersonUseCase: RegisterPersonUseCase,
    private readonly findPersonByCedulaUseCase: FindPersonByCedulaUseCase,
    private readonly updatePersonUseCase: UpdatePersonUseCase,
  ) {}

  @Post()
  async register(@Body() dto: RegisterPersonDto) {
    try {
      const person = await this.registerPersonUseCase.execute({
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      });
      return this.toResponse(person);
    } catch (error) {
      if (error instanceof EntityAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get('by-cedula/:cedula')
  async findByCedula(@Param('cedula') cedula: string) {
    try {
      const person = await this.findPersonByCedulaUseCase.execute(cedula);
      return this.toResponse(person);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    try {
      const person = await this.updatePersonUseCase.execute({
        id,
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      });
      return this.toResponse(person);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  private toResponse(person: Person) {
    return person.toSnapshot();
  }
}
