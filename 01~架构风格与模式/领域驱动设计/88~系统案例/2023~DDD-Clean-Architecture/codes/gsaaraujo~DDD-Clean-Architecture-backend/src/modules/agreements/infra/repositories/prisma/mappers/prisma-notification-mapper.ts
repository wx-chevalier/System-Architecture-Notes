import { Notification as NotificationORM } from '@prisma/client';

import { Notification } from '@agreements/domain/entities/notification';

export class PrismaNotificationMapper {
  public static toDomain(notificationORM: NotificationORM): Notification {
    return Notification.create(
      {
        recipientPartyId: notificationORM.recipientProfileId,
        title: notificationORM.title,
        readAt: notificationORM.readAt,
        content: notificationORM.content,
        createdAt: notificationORM.sentAt,
      },
      notificationORM.id,
    ).value as Notification;
  }

  public static toPersistence(notification: Notification): NotificationORM {
    return {
      id: notification.id,
      recipientProfileId: notification.recipientPartyId,
      title: notification.title,
      readAt: notification.readAt,
      content: notification.content,
      sentAt: notification.createdAt,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };
  }
}
