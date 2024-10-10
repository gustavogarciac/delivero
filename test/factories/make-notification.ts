import { UniqueEntityId } from "@/core/entities/unique-entity-id";

import { faker } from "@faker-js/faker";
import { Notification, NotificationProps } from "@/domain/notification/enterprise/entities/notification";

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {

  const notification = Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      recipientId: new UniqueEntityId(),
      readAt: null,
      ...override
    },
    id
  )

  return notification
}