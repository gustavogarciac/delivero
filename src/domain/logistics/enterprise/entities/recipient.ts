import { Entity } from "@/core/entities/entity";
import { Order } from "./order";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface RecipientProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  orders?: Order[] | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  lastOrderAt?: Date | null;
}

export class Recipient extends Entity<RecipientProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get address(): string {
    return this.props.address;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get zip(): string {
    return this.props.zip;
  }

  get country(): string {
    return this.props.country;
  }

  get orders(): Order[] | null {
    return this.props.orders ?? null;
  }

  get createdAt(): Date | null {
    return this.props.createdAt ?? null;
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null;
  }

  get lastOrderAt(): Date | null {
    return this.props.lastOrderAt ?? null;
  }

  // Setters
  set name(value: string) {
    this.props.name = value;
  }

  set email(value: string) {
    this.props.email = value;
  }

  set phone(value: string) {
    this.props.phone = value;
  }

  set address(value: string) {
    this.props.address = value;
  }

  set city(value: string) {
    this.props.city = value;
  }

  set state(value: string) {
    this.props.state = value;
  }

  set zip(value: string) {
    this.props.zip = value;
  }

  set country(value: string) {
    this.props.country = value;
  }

  set orders(value: Order[]) {
    this.props.orders = value;
  }

  set createdAt(value: Date | null) {
    this.props.createdAt = value;
  }

  set updatedAt(value: Date | null) {
    this.props.updatedAt = value;
  }

  set lastOrderAt(value: Date | null) {
    this.props.lastOrderAt = value;
  }

  protected constructor(props: RecipientProps, id?: UniqueEntityId) {
    super(props, id)
  }


  static create(props: RecipientProps, id?: UniqueEntityId): Recipient {
    return new Recipient(props, id)
  }
}