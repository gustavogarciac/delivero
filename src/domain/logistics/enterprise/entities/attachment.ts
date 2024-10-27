import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export enum AttachmentType {
  ORDER = "ORDER",
}

export interface AttachmentProps {
  url: string;
  title: string
  type?: AttachmentType;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Attachment extends Entity<AttachmentProps> {
  get url(): string {
    return this.props.url
  }

  get title(): string {
    return this.props.title
  }

  get type(): AttachmentType | undefined {
    return this.props.type
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  protected constructor(props: AttachmentProps, id?: UniqueEntityId) {
    super(props, id)
  }
}