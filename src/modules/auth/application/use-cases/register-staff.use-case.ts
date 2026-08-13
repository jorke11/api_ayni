import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PASSWORD_HASHER } from '../../../../shared/kernel/password-hasher.port';
import type { PasswordHasherPort } from '../../../../shared/kernel/password-hasher.port';
import { EntityAlreadyExistsError } from '../../../../shared/kernel/domain-errors';
import { StaffUser } from '../../domain/entities/staff-user.entity';
import type { StaffRole } from '../../domain/entities/staff-user.entity';
import { STAFF_USER_REPOSITORY } from '../../domain/ports/staff-user-repository.port';
import type { StaffUserRepositoryPort } from '../../domain/ports/staff-user-repository.port';
import { STAFF_USER_WRITER } from '../../domain/ports/staff-user-writer.port';
import type { StaffUserWriterPort } from '../../domain/ports/staff-user-writer.port';

export interface RegisterStaffInput {
  cedula: string;
  fullName: string;
  pin: string;
  role: StaffRole;
}

@Injectable()
export class RegisterStaffUseCase {
  constructor(
    @Inject(STAFF_USER_REPOSITORY)
    private readonly staffUserRepository: StaffUserRepositoryPort,
    @Inject(STAFF_USER_WRITER)
    private readonly staffUserWriter: StaffUserWriterPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: RegisterStaffInput): Promise<StaffUser> {
    const existing = await this.staffUserRepository.findByCedula(input.cedula);
    if (existing) {
      throw new EntityAlreadyExistsError('Ya existe un usuario de staff con esta cédula');
    }

    const pinHash = await this.passwordHasher.hash(input.pin);

    const staff = StaffUser.create({
      id: randomUUID(),
      cedula: input.cedula,
      fullName: input.fullName,
      pinHash,
      role: input.role,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.staffUserWriter.save(staff);
  }
}
