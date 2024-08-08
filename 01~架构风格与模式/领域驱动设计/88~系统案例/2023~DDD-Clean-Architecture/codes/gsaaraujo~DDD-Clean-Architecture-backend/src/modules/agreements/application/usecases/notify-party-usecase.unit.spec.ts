import { makeParty } from '@agreements/domain/tests/factories/party-factory';

import { NotifyPartyUsecase } from '@agreements/application/usecases/notify-party-usecase';

import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';
import { FakeNotificationService } from '@agreements/infra/services/fake/fake-notification-service';
import { FakeNotificationRepository } from '@agreements/infra/repositories/fake/fake-notification-repository';

describe('notify-party-usecase', () => {
  let notifyPartyUsecase: NotifyPartyUsecase;

  let fakePartyRepository: FakePartyRepository;
  let fakeNotificationRepository: FakeNotificationRepository;
  let fakeNotificationService: FakeNotificationService;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeNotificationService = new FakeNotificationService();

    notifyPartyUsecase = new NotifyPartyUsecase(
      fakePartyRepository,
      fakeNotificationRepository,
      fakeNotificationService,
    );
  });

  it('should notify the parties', async () => {
    const fakeParty1 = makeParty({ id: '3e41372f-1f25-4b4d-9a04-eafa55e0f259' });

    fakePartyRepository.parties.push(fakeParty1);

    const sut = await notifyPartyUsecase.execute({
      partyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      title: 'any_title',
      content: 'any_content',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();
  });
});
