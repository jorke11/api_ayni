import { LoginStaffUseCase } from './login-staff.use-case';
import { InvalidCredentialsError } from '../../../../shared/kernel/domain-errors';
import type { StaffUserRepositoryPort } from '../../domain/ports/staff-user-repository.port';
import type { PasswordHasherPort } from '../../../../shared/kernel/password-hasher.port';
import type { TokenIssuerPort } from '../../domain/ports/token-issuer.port';
import { StaffUser } from '../../domain/entities/staff-user.entity';

const buildStaff = (overrides: Partial<{ active: boolean }> = {}) =>
  StaffUser.create({
    id: 'staff-1',
    cedula: '0102030405',
    fullName: 'Carlos Ruiz',
    pinHash: 'hashed-pin',
    role: 'OPERATOR',
    active: overrides.active ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

describe('LoginStaffUseCase', () => {
  let staffUserRepository: jest.Mocked<StaffUserRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let tokenIssuer: jest.Mocked<TokenIssuerPort>;
  let useCase: LoginStaffUseCase;

  beforeEach(() => {
    staffUserRepository = { findByCedula: jest.fn(), findById: jest.fn() };
    passwordHasher = { hash: jest.fn(), compare: jest.fn() };
    tokenIssuer = { issue: jest.fn().mockReturnValue('signed-jwt') };
    useCase = new LoginStaffUseCase(staffUserRepository, passwordHasher, tokenIssuer);
  });

  it('issues a token when the cedula and pin are valid', async () => {
    staffUserRepository.findByCedula.mockResolvedValue(buildStaff());
    passwordHasher.compare.mockResolvedValue(true);

    const result = await useCase.execute({ cedula: '0102030405', pin: '1234' });

    expect(result.accessToken).toBe('signed-jwt');
    expect(result.staff.cedula).toBe('0102030405');
  });

  it('rejects login when the staff user does not exist', async () => {
    staffUserRepository.findByCedula.mockResolvedValue(null);

    await expect(useCase.execute({ cedula: '0000000000', pin: '1234' })).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('rejects login when the staff user is inactive', async () => {
    staffUserRepository.findByCedula.mockResolvedValue(buildStaff({ active: false }));

    await expect(useCase.execute({ cedula: '0102030405', pin: '1234' })).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('rejects login when the pin is incorrect', async () => {
    staffUserRepository.findByCedula.mockResolvedValue(buildStaff());
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute({ cedula: '0102030405', pin: 'wrong' })).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
    expect(tokenIssuer.issue).not.toHaveBeenCalled();
  });
});
