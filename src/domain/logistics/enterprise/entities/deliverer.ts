// import { Entity } from "@/core/entities/entity";
// import { UniqueEntityId } from "@/core/entities/unique-entity-id";
// import { Cpf } from "./value-objects/cpf";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "./user";
import { Vehicle } from "./vehicle";
import { Geolocalization } from "./value-objects/geolocalization";

// export interface DeliveryManProps {
//   name: string
//   cpf: Cpf
//   password: string
//   createdAt?: Date | null
//   updatedAt?: Date | null
// }

// export class DeliveryMan extends Entity<DeliveryManProps> {
//   get name() {
//     return this.props.name
//   }
//   get cpf() {
//     return this.props.cpf
//   }
//   get password() {
//     return this.props.password
//   }
//   get createdAt() {
//     return this.props.createdAt
//   }
//   get updatedAt() {
//     return this.props.updatedAt
//   }

//   touch() {
//     this.props.updatedAt = new Date()
//   }

//   set name(name: string) {
//     this.props.name = name
//     this.touch()
//   }

//   set cpf(cpf: Cpf) {
//     this.props.cpf = cpf
//     this.touch()
//   }

//   set password(password: string) {
//     this.props.password = password
//     this.touch()
//   }

//   static create({
//     name,
//     cpf, 
//     password,
//   }: DeliveryManProps, id?: UniqueEntityId) {
//     const deliveryMan = new DeliveryMan({
//       name,
//       cpf,
//       password,
//       createdAt: new Date(),
//       updatedAt: null
//     }, id)

//     return deliveryMan
//   }
// }


interface DelivererProps {
  vehicle: Vehicle
  isAvailable: boolean
  // geo: Geolocation // TODO: STUDY GEOLOCATION OBJECT
  geo: Geolocalization
  deliveriesCount: number
  rating: number
  createdAt?: Date | null
  updatedAt?: Date | null
}
export class Deliverer extends User {
  private delivererProps: DelivererProps

  get vehicle() {
    return this.delivererProps.vehicle
  }

  get isAvailable() {
    return this.delivererProps.isAvailable
  }

  get geo() {
    return this.delivererProps.geo
  }

  get deliveriesCount() {
    return this.delivererProps.deliveriesCount
  }

  get rating() {
    return this.delivererProps.rating
  }

  get createdAt() {
    return this.delivererProps.createdAt
  }

  get updatedAt() {
    return this.delivererProps.updatedAt
  }

  protected constructor(delivererProps: DelivererProps, userProps: UserProps, id?: UniqueEntityId) {
    super(userProps, id)
    this.delivererProps = delivererProps
  }

  static create(delivererProps: DelivererProps, userProps: UserProps, id?: UniqueEntityId) {
    return new Deliverer({
      ...delivererProps,
      createdAt: new Date(),
      updatedAt: null
    }, userProps, id)
  }
}