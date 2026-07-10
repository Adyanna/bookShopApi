import { Entity, EntityProps } from '../global/Entity';

export enum BookStatus {
  PUBLISHED = 'PUBLISHED',
  SOLD = 'SOLD',
}

interface BookProps extends EntityProps {
  title: string;
  description: string;
  price: number;
  author: string;
  status?: BookStatus;
  ownerId: number;
  soldAt?: Date | null;
}

export class Book extends Entity {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly author: string;
  readonly status: BookStatus;
  readonly ownerId: number;
  readonly soldAt: Date | null;

  constructor(props: BookProps) {
    super({ id: props.id, createAt: props.createAt });
    this.title = props.title;
    this.description = props.description;
    this.price = props.price;
    this.author = props.author;
    this.status = props.status ?? BookStatus.PUBLISHED;
    this.ownerId = props.ownerId;
    this.soldAt = props.soldAt ?? null;
  }
}
