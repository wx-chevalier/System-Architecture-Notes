import { Notification } from '@agreements/domain/entities/notification';

import { FakeNotificationRepository } from '@agreements/infra/repositories/fake/fake-notification-repository';

describe('fake-notification-repository', () => {
  let fakeNotificationRepository: FakeNotificationRepository;

  beforeEach(() => {
    fakeNotificationRepository = new FakeNotificationRepository();
  });

  describe('create', () => {
    it('should persist and return a notification', async () => {
      const fakeNotification = Notification.create({
        recipientPartyId: 'any_recipient_party_id',
        title: 'any_title',
        content: 'any_content',
      }).value as Notification;

      const sut = await fakeNotificationRepository.create(fakeNotification);

      expect(sut).toStrictEqual(fakeNotification);
      expect(fakeNotificationRepository.notifications.length).toBe(1);
    });
  });
});
