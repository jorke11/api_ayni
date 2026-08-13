import { Inject, Injectable } from '@nestjs/common';
import { PASSWORD_HASHER } from '../../../../shared/kernel/password-hasher.port';
import type { PasswordHasherPort } from '../../../../shared/kernel/password-hasher.port';
import { InvalidCredentialsError } from '../../../../shared/kernel/domain-errors';
import { STAFF_USER_REPOSITORY } from '../../domain/ports/staff-user-repository.port';
import type { StaffUserRepositoryPort } from '../../domain/ports/staff-user-repository.port';
import { TOKEN_ISSUER } from '../../domain/ports/token-issuer.port';
import type { TokenIssuerPort } from '../../domain/ports/token-issuer.port';

export interface LoginStaffInput {
  cedula: string;
  pin: string;
}

export interface LoginStaffOutput {
  accessToken: string;
  staff: {
    id: string;
    cedula: string;
    fullName: string;
    role: string;
  };
}

@Injectable()
export class LoginStaffUseCase {
  constructor(
    @Inject(STAFF_USER_REPOSITORY)
    private readonly staffUserRepository: StaffUserRepositoryPort,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_ISSUER)
    private readonly tokenIssuer: TokenIssuerPort,
  ) {}

  async execute(input: LoginStaffInput): Promise<LoginStaffOutput> {
    const staff = await this.staffUserRepository.findByCedula(input.cedula);

    if (!staff || !staff.active) {
      throw new InvalidCredentialsError('Cédula o PIN incorrectos');
    }

    const isPinValid = await this.passwordHasher.compare(input.pin, staff.pinHash);
    if (!isPinValid) {
      throw new InvalidCredentialsError('Cédula o PIN incorrectos');
    }

    const accessToken = this.tokenIssuer.issue({
      sub: staff.id,
      cedula: staff.cedula,
      role: staff.role,
    });

    return {
      accessToken,
      staff: {
        id: staff.id,
        cedula: staff.cedula,
        fullName: staff.fullName,
        role: staff.role,
      },
    };
  }
}
