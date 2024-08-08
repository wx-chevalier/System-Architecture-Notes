import { Notification } from '@agreements/domain/entities/notification';

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>;
}
