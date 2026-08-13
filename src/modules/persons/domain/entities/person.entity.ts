export type VulnerabilityReason =
  | 'ELDERLY'
  | 'PREGNANT'
  | 'DISABILITY'
  | 'MINOR'
  | 'CHRONIC_ILLNESS'
  | 'OTHER';

export interface PersonProps {
  id: string;
  cedula: string;
  fullName: string;
  birthDate: Date | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  householdSize: number | null;
  isVulnerable: boolean;
  vulnerabilityReasons: VulnerabilityReason[];
  diseases: string[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Person {
  private constructor(private readonly props: PersonProps) {}

  static create(props: PersonProps): Person {
    return new Person(props);
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

  get isVulnerable(): boolean {
    return this.props.isVulnerable;
  }

  get vulnerabilityReasons(): VulnerabilityReason[] {
    return this.props.vulnerabilityReasons;
  }

  get diseases(): string[] {
    return this.props.diseases;
  }

  toSnapshot(): PersonProps {
    return { ...this.props };
  }
}
