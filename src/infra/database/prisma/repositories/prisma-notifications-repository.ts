import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { PrismaService } from "../prisma.service";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}
  create(notification: Notification): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(notification: Notification): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Notification | null> {
    throw new Error("Method not implemented.");
  }
}