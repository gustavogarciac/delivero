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


export interface DelivererProps {
  vehicle?: Vehicle | null
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

  get vehicle(): Vehicle | null {
    return this.delivererProps.vehicle ?? null
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

  set vehicle(vehicle: Vehicle) {
    this.delivererProps.vehicle = vehicle
  }

  protected constructor(delivererProps: DelivererProps, userProps: UserProps, id?: UniqueEntityId) {
    super(userProps, id)
    this.delivererProps = delivererProps
  }

  /**
 * This function creates a Deliverer entity with the given properties.
 * 
 * @param {DelivererProps} delivererProps - The properties of the deliverer, including vehicle, availability, geolocation, number of deliveries, and rating.
 * @param {UserProps} userProps - The base properties of the user, such as name, cpf, password, and email.
 * @param {UniqueEntityId} [id] - Optional unique entity ID for the deliverer.
 * @returns {Deliverer} - Returns a new instance of the Deliverer entity.
 * 
 * @example
 * const geo = new Geolocalization({ latitude: 0, longitude: 0 });
 * const userProps = { cpf: Cpf.create("40171993055"), name: "John Doe", password: "password", email: "john@example.com" };
 * const delivererProps = { deliveriesCount: 0, geo, isAvailable: true, rating: 5 };
 * const deliverer = Deliverer.create(delivererProps, userProps);
 */
  static create(delivererProps: DelivererProps, userProps: UserProps, id?: UniqueEntityId) {
    return new Deliverer({
      ...delivererProps,
      createdAt: new Date(),
      updatedAt: null
    }, userProps, id)
  }
}