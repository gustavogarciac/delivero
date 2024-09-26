import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  TRUCK = 'truck',
  BIKE = 'bike',
}

interface VehicleProps {
  plate: string
  model: string
  year: number
  type: VehicleType
  color: string
  capacity: number
  mileage: number
  delivererId?: UniqueEntityId | null
  createdAt?: Date | null
  updatedAt?: Date | null
}

export class Vehicle extends Entity<VehicleProps> {
  get plate() {
    return this.props.plate
  }
  get model() {
    return this.props.model
  }
  get year() {
    return this.props.year
  }
  get type() {
    return this.props.type
  }
  get color() {
    return this.props.color
  }
  get capacity() {
    return this.props.capacity
  }
  get mileage() {
    return this.props.mileage
  }
  get delivererId() {
    return this.props.delivererId
  }
  get createdAt() {
    return this.props.createdAt
  }
  get updatedAt() {
    return this.props.updatedAt
  }

  static create(vehicleProps: VehicleProps, id?: UniqueEntityId) {
    return new Vehicle({
      ...vehicleProps,
      createdAt: new Date(),
      updatedAt: null
    }, id)
  }
}