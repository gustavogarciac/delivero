import { makeNotification } from "test/factories/make-notification"
import { ReadNotificationUseCase } from "./read-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { makeRecipient } from "test/factories/make-recipient"

let notificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe("Read Notification Use Case", async () => {
  beforeEach(async () => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(notificationsRepository)
  })

  it("should read a notification", async () => {
    const recipient = makeRecipient()
      
    const notification = makeNotification({ recipientId: recipient.id })

    expect(notification.readAt).toBeNull()

    await notificationsRepository.items.push(notification)

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: recipient.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    
    expect(notification.readAt).not.toBeNull()
    expect(notificationsRepository.items[0].readAt).not.toBeNull()
  })
})