export type StaffRole = 'ADMIN' | 'OPERATOR';

export interface StaffUserProps {
  id: string;
  cedula: string;
  fullName: string;
  pinHash: string;
  role: StaffRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class StaffUser {
  private constructor(private readonly props: StaffUserProps) {}

  static create(props: StaffUserProps): StaffUser {
    return new StaffUser(props);
  }

  get id(): string {
    return this.props.id;
  }

  get cedula(): string {
    return this.props.cedula;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get pinHash(): string {
    return this.props.pinHash;
  }

  get role(): StaffRole {
    return this.props.role;
  }

  get active(): boolean {
    return this.props.active;
  }
}
