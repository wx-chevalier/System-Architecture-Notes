import { Notification, NotificationProps } from '@agreements/domain/entities/notification';

type MakeNotificationProps = Partial<NotificationProps>;

export const makeNotification = (id?: string, props?: MakeNotificationProps): Notification => {
  return Notification.create(
    {
      recipientPartyId: 'd5e4c4e4-6844-4c5b-8304-ec64ecfe8011',
      readAt: null,
      title: 'any_title',
      createdAt: new Date('2023-01-01'),
      content: 'any_content',
      ...props,
    },
    id ?? '8f50d27d-a813-4ff0-b78a-9c3a21cecbb2',
  ).value as Notification;
};
