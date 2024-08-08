import { Notification } from '@agreements/domain/entities/notification';
import { CharactersLimitError } from '@agreements/domain/errors/characters-limit-error';

describe('Notification', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a notification', () => {
    const sut = Notification.create({
      recipientPartyId: 'any_recipient_party_id',
      title: 'any_title',
      content: 'any_content',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(Notification);
  });

  it('should reconstitute a notification', () => {
    const sut = Notification.create(
      {
        recipientPartyId: 'any_recipient_party_id',
        readAt: null,
        title: 'any_title',
        createdAt: new Date(),
        content: 'any_content',
      },
      'bc2ac0ce-8428-4a3a-955e-21489e380045',
    );

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(Notification);
    expect((sut.value as Notification).id).toBe('bc2ac0ce-8428-4a3a-955e-21489e380045');
  });

  it('should mark a notification as read', () => {
    const fakeNotification = Notification.create({
      recipientPartyId: 'any_recipient_party_id',
      title: 'any_title',
      content: 'any_content',
    }).value as Notification;

    const sut = fakeNotification.hasBeenRead();

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();
    expect(fakeNotification.readAt).not.toBeNull();
  });

  it('should return CharactersLimitError if title is less than 3 characters', () => {
    const sut = Notification.create({
      title: 'ab',
      content: 'any_content',
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CharactersLimitError);
  });

  it('should return CharactersLimitError if title is greater than 80 characters', () => {
    const sut = Notification.create({
      title: 'abc'.repeat(80),
      content: 'any_content',
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CharactersLimitError);
  });

  it('should return CharactersLimitError if content is less than 3 characters', () => {
    const sut = Notification.create({
      title: 'any_title',
      content: 'ab',
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CharactersLimitError);
  });

  it('should return CharactersLimitError if content is greater than 160 characters', () => {
    const sut = Notification.create({
      title: 'any_title',
      content: 'abc'.repeat(80),
      recipientPartyId: 'any_recipient_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CharactersLimitError);
  });
});
