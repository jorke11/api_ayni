import { StaffUser } from '../entities/staff-user.entity';

export const STAFF_USER_WRITER = Symbol('STAFF_USER_WRITER');

export interface StaffUserWriterPort {
  save(staffUser: StaffUser): Promise<StaffUser>;
}
