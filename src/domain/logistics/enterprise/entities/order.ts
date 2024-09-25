import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Geolocalization } from "./value-objects/geolocalization";

export enum OrderStatus {
  AWAITING_PICKUP,
  IN_TRANSIT,
  DELIVERED,
  RETURNED
}

type OrderProps = {
  delivererId: UniqueEntityId,
  recipientId: UniqueEntityId,
  adminId?: UniqueEntityId | null,
  status: OrderStatus,
  pickupCode: string,
  deliveryAddress: string,
  geo: Geolocalization,
  trackingNumber?: string | null,
  notes?: string | null,
  pickedAt?: Date | null,
  deliveredAt?: Date | null,
  returnedAt?: Date | null,
  updatedAt?: Date | null,
  createdAt: Date
}

export class Order extends Entity<OrderProps> {
  get delivererId() {
    return this.props.delivererId
  }
  get recipientId() {
    return this.props.recipientId
  }
  get adminId() {
    return this.props.adminId ?? null
  }
  get status() {
    return this.props.status
  }
  get pickupCode() {
    return this.props.pickupCode
  }
  get deliveryAddress() {
    return this.props.deliveryAddress
  }
  get geo() {
    return this.props.geo
  }
  get trackingNumber() {
    return this.props.trackingNumber ?? null
  }
  get notes() {
    return this.props.notes ?? null
  }
  get pickedAt() {
    return this.props.pickedAt ?? null
  }
  get deliveredAt() {
    return this.props.deliveredAt ?? null
  }
  get returnedAt() {
    return this.props.returnedAt ?? null
  }

  touch() {
    this.props.updatedAt = new Date()
  }

  set delivererId(delivererId: UniqueEntityId) {
    this.props.delivererId = delivererId
    this.touch()
  }

  set recipientId(recipientId: UniqueEntityId) {
    this.props.recipientId = recipientId
    this.touch()
  }

  set adminId(adminId: UniqueEntityId | null) {
    this.props.adminId = adminId
    this.touch()
  }

  set status(status: OrderStatus) {
    this.props.status = status
    this.touch()
  }

  set pickupCode(pickupCode: string) {
    this.props.pickupCode = pickupCode
    this.touch()
  }

  set deliveryAddress(deliveryAddress: string) {
    this.props.deliveryAddress = deliveryAddress
    this.touch()
  }

  set geo(geo: Geolocalization) {
    this.props.geo = geo
    this.touch()
  }

  set trackingNumber(trackingNumber: string | null) {
    this.props.trackingNumber = trackingNumber
    this.touch()
  }

  set notes(notes: string | null) {
    this.props.notes = notes
    this.touch()
  }

  set pickedAt(pickedAt: Date | null) {
    this.props.pickedAt = pickedAt
    this.touch()
  }

  set deliveredAt(deliveredAt: Date | null) {
    this.props.deliveredAt = deliveredAt
    this.touch()
  }

  set returnedAt(returnedAt: Date | null) {
    this.props.returnedAt = returnedAt
    this.touch()
  }

  static create({
    delivererId,
    recipientId,
    adminId,
    status,
    deliveryAddress,
    geo,
    notes,
    pickedAt,
    deliveredAt,
    returnedAt,
  }: Omit<OrderProps, 'createdAt' | 'pickupCode'>, id?: UniqueEntityId) {
    const order = new Order({
      delivererId,
      recipientId,
      adminId,
      status,
      pickupCode: Math.random().toString(36).substring(7),
      deliveryAddress,
      geo,
      notes,
      pickedAt,
      deliveredAt,
      returnedAt,
      createdAt: new Date()
    }, id)

    return order
  }
}