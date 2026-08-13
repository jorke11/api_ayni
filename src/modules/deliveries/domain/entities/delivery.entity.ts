export interface DeliveryItemProps {
  supplyItemId: string;
  quantity: number;
}

export interface DeliveryProps {
  id: string;
  personId: string;
  staffUserId: string;
  deliveredAt: Date;
  items: DeliveryItemProps[];
  notes: string | null;
  createdAt: Date;
}

export class Delivery {
  private constructor(private readonly props: DeliveryProps) {}

  static create(props: DeliveryProps): Delivery {
    if (props.items.length === 0) {
      throw new Error('A delivery must contain at least one item');
    }
    return new Delivery(props);
  }

  get id(): string {
    return this.props.id;
  }

  get personId(): string {
    return this.props.personId;
  }

  get deliveredAt(): Date {
    return this.props.deliveredAt;
  }

  get items(): DeliveryItemProps[] {
    return this.props.items;
  }

  toSnapshot(): DeliveryProps {
    return { ...this.props, items: [...this.props.items] };
  }
}
