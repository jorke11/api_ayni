import { StaffUser } from '../entities/staff-user.entity';

export const STAFF_USER_REPOSITORY = Symbol('STAFF_USER_REPOSITORY');

export interface StaffUserRepositoryPort {
  findByCedula(cedula: string): Promise<StaffUser | null>;
  findById(id: string): Promise<StaffUser | null>;
}
