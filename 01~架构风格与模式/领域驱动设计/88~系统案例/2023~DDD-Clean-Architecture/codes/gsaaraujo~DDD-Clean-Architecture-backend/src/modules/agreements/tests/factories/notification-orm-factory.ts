import { Notification as NotificationORM } from '@prisma/client';

type MakeNotificationORMProps = Partial<NotificationORM>;

export const makeNotificationORM = (props?: MakeNotificationORMProps): NotificationORM => {
  return {
    id: '46dc0186-4a57-4f0b-ac79-db33e3ddb058',
    recipientProfileId: '1f9e2b14-450a-49b7-a199-83f01b126144',
    title: 'any_title',
    content: 'any_content',
    sentAt: new Date('2023-01-01'),
    readAt: null,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    ...props,
  };
};
