import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export enum AttachmentType {
  ORDER = "ORDER",
}

export interface AttachmentProps {
  url: string;
  title: string
  type?: AttachmentType;
}

export abstract class Attachment extends Entity<AttachmentProps> {
  get url(): string {
    return this.props.url
  }

  get title(): string {
    return this.props.title
  }

  protected constructor(props: AttachmentProps, id?: UniqueEntityId) {
    super(props, id)
  }
}