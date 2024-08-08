import { Notification } from '@agreements/domain/entities/notification';

import { INotificationRepository } from '@agreements/application/repositories/notification-repository';

export class FakeNotificationRepository implements INotificationRepository {
  public notifications: Notification[] = [];

  async create(notification: Notification): Promise<Notification> {
    this.notifications.push(notification);
    return notification;
  }
}
