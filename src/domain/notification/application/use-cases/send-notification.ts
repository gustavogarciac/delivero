import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { Either, right } from "@/core/either";

interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

type SendNotificationUseCaseResponse = Either<null, { notification: Notification }>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content
  }: SendNotificationUseCaseRequest) : Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId:  new UniqueEntityId(recipientId),
      title,
      content,
      readAt: null
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}