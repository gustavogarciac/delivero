import { makeOrder } from "test/factories/make-order"
import { SendNotificationUseCase } from "./send-notification"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe("Send Notification Use Case", async () => {
  beforeEach(async () => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it("should send a notification", async () => {
    const result = await sut.execute({
      recipientId: "recipient-id",
      title: "New notification",
      content: "You have a new notification"
    })

    expect(result.isRight()).toBeTruthy()
    
    expect(result.value?.notification).toEqual(expect.objectContaining({
      title: "New notification",
    }))
  })
})