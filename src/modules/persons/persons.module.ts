import { Module } from '@nestjs/common';
import { RegisterPersonUseCase } from './application/use-cases/register-person.use-case';
import { FindPersonByCedulaUseCase } from './application/use-cases/find-person-by-cedula.use-case';
import { UpdatePersonUseCase } from './application/use-cases/update-person.use-case';
import { PERSON_REPOSITORY } from './domain/ports/person-repository.port';
import { PrismaPersonRepository } from './infrastructure/persistence/prisma-person.repository';
import { PersonsController } from './infrastructure/http/persons.controller';

@Module({
  controllers: [PersonsController],
  providers: [
    RegisterPersonUseCase,
    FindPersonByCedulaUseCase,
    UpdatePersonUseCase,
    { provide: PERSON_REPOSITORY, useClass: PrismaPersonRepository },
  ],
  exports: [PERSON_REPOSITORY],
})
export class PersonsModule {}
