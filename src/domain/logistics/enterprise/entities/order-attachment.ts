import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Attachment, AttachmentProps, AttachmentType } from "./attachment";

interface OrderAttachmentProps {
  orderId: string;
  delivererId: string;
}

export class OrderAttachment extends Attachment {
  private orderAttachmentProps: OrderAttachmentProps;

  get orderId(): string {
    return this.orderAttachmentProps.orderId;
  }

  get delivererId(): string {
    return this.orderAttachmentProps.delivererId;
  }

  protected constructor(orderAttachmentProps: OrderAttachmentProps, attachmentProps: AttachmentProps, id?: UniqueEntityId) {
    super({
      ...attachmentProps,
      type: AttachmentType.ORDER,
    })
    this.orderAttachmentProps = orderAttachmentProps;
  }

  static create(orderAttachmentProps: OrderAttachmentProps, attachmentProps: AttachmentProps, id?: UniqueEntityId): OrderAttachment {
    return new OrderAttachment(orderAttachmentProps, attachmentProps, id);
  }
}