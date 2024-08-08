import { any, mock } from 'jest-mock-extended';

import { MockBaseError } from '@core/tests/mocks/mock-base-error';

import { left, right } from '@core/domain/helpers/either';
import { DomainError } from '@core/domain/errors/domain-error';

import { makeParty } from '@agreements/domain/tests/factories/party-factory';
import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { MakeAnAgreementUsecase } from '@agreements/application/usecases/make-an-agreement-usecase';

import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';
import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('make-an-agreement-usecase', () => {
  let makeAnAgreementUsecase: MakeAnAgreementUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;
  let mockNotifyPartyUsecase: INotifyPartyUsecase;
  let fakePartyRepository: FakePartyRepository;

  beforeEach(() => {
    mockNotifyPartyUsecase = mock<INotifyPartyUsecase>();
    fakePartyRepository = new FakePartyRepository();
    fakeAgreementRepository = new FakeAgreementRepository();

    makeAnAgreementUsecase = new MakeAnAgreementUsecase(
      mockNotifyPartyUsecase,
      fakePartyRepository,
      fakeAgreementRepository,
    );
  });

  it('should make an agreement and notify the parties', async () => {
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const fakeParty1 = makeParty({ id: '3e41372f-1f25-4b4d-9a04-eafa55e0f259' });
    const fakeParty2 = makeParty({ id: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35' });

    fakePartyRepository.parties.push(fakeParty1);
    fakePartyRepository.parties.push(fakeParty2);

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      creditorPartyId: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(fakeAgreementRepository.agreements.length).toBe(1);

    expect(mockNotifyPartyUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content:
        'A agreement between a2adf2a3-0c0e-4e91-b131-6beb87b8af35 (creditor) and 3e41372f-1f25-4b4d-9a04-eafa55e0f259 (debtor) has been created.',
      partyId: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    });
    expect(mockNotifyPartyUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content:
        'A agreement between a2adf2a3-0c0e-4e91-b131-6beb87b8af35 (creditor) and 3e41372f-1f25-4b4d-9a04-eafa55e0f259 (debtor) has been created.',
      partyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
    });
  });

  it('should return PartyNotFoundError if the creditor was not found', async () => {
    const fakeParty1 = makeParty({ id: '3e41372f-1f25-4b4d-9a04-eafa55e0f259' });
    const fakeParty2 = makeParty({ id: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35' });

    fakePartyRepository.parties.push(fakeParty1);
    fakePartyRepository.parties.push(fakeParty2);

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'a8c0a335-f410-4dad-a915-21691d617b6c',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });

  it('should return PartyNotFoundError if the debtor was not found', async () => {
    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: '6fabf0ed-b15d-4ae0-8627-917faabada17',
      creditorPartyId: 'any_creditor_party_id',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });

  it('should return PartyNotFoundError if the creditor was not found', async () => {
    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'a8c0a335-f410-4dad-a915-21691d617b6c',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });

  it('should return an error if the creation of the owing item fails', async () => {
    const fakeParty1 = makeParty({ id: '3e41372f-1f25-4b4d-9a04-eafa55e0f259' });
    const fakeParty2 = makeParty({ id: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35' });

    fakePartyRepository.parties.push(fakeParty1);
    fakePartyRepository.parties.push(fakeParty2);

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2.5,
      isCurrency: true,
      description: 'any_description',
      debtorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      creditorPartyId: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DomainError);
  });

  it('should return an error if the creation of the agreement fails', async () => {
    const fakeParty1 = makeParty({ id: '3e41372f-1f25-4b4d-9a04-eafa55e0f259' });
    const fakeParty2 = makeParty({ id: 'a2adf2a3-0c0e-4e91-b131-6beb87b8af35' });

    fakePartyRepository.parties.push(fakeParty1);
    fakePartyRepository.parties.push(fakeParty2);

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
      creditorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DomainError);
  });

  it('should return an error if the sending of the notification fails', async () => {
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(left(new MockBaseError()));
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const fakeParty1 = makeParty({ id: '7e25135b-7ee3-447a-a722-aa81e0285b26' });
    const fakeParty2 = makeParty({ id: '3e41372f-1f25-4b4d-9a04-eafa55e0f259' });

    fakePartyRepository.parties.push(fakeParty1);
    fakePartyRepository.parties.push(fakeParty2);

    const sut = await makeAnAgreementUsecase.execute({
      amount: 2,
      isCurrency: false,
      description: 'any_description',
      debtorPartyId: '7e25135b-7ee3-447a-a722-aa81e0285b26',
      creditorPartyId: '3e41372f-1f25-4b4d-9a04-eafa55e0f259',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(MockBaseError);
  });
});
