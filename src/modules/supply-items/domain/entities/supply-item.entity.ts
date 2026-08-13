export type SupplyCategory = 'MEDICINE' | 'FOOD' | 'CLOTHING' | 'HYGIENE' | 'OTHER';

export interface SupplyItemProps {
  id: string;
  name: string;
  category: SupplyCategory;
  unit: string;
}

export class SupplyItem {
  private constructor(private readonly props: SupplyItemProps) {}

  static create(props: SupplyItemProps): SupplyItem {
    return new SupplyItem(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get category(): SupplyCategory {
    return this.props.category;
  }

  get unit(): string {
    return this.props.unit;
  }

  toSnapshot(): SupplyItemProps {
    return { ...this.props };
  }
}
