import { NotificationsRepository } from "../repositories/notifications-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { BadRequestError } from "@/core/errors/bad-request-error";

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError, object>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest) : Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId)

    if(!notification) return left(new ResourceNotFoundError())

    const notificationAuthor = notification.recipientId.toString()

    if(notificationAuthor !== recipientId) return left(new BadRequestError())

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({})
  }
}