import { any, mock } from 'jest-mock-extended';

import { MockBaseError } from '@core/tests/mocks/mock-base-error';

import { left, right } from '@core/domain/helpers/either';
import { BaseError } from '@core/domain/errors/base-error';
import { DomainError } from '@core/domain/errors/domain-error';

import { makeAgreement } from '@agreements/domain/tests/factories/agreement-factory';
import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';
import { CancelAnAgreementUsecase } from '@agreements/application/usecases/cancel-an-agreement-usecase';

import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('cancel-an-agreement-usecase', () => {
  let cancelAnAgreementUsecase: CancelAnAgreementUsecase;

  let mockNotifyPartyUsecase: INotifyPartyUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    mockNotifyPartyUsecase = mock<INotifyPartyUsecase>();
    fakeAgreementRepository = new FakeAgreementRepository();

    cancelAnAgreementUsecase = new CancelAnAgreementUsecase(
      mockNotifyPartyUsecase,
      fakeAgreementRepository,
    );
  });

  it('should cancel an agreement as creditor and notify the debtor', async () => {
    const fakeAgreement = makeAgreement();
    fakeAgreement.creditorPartyConsent.acceptAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: fakeAgreement.creditorPartyId,
      agreementId: fakeAgreement.id,
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(mockNotifyPartyUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content: `The creditor ${fakeAgreement.creditorPartyId} has canceled his part of the agreement.`,
      partyId: fakeAgreement.debtorPartyId,
    });
  });

  it('should cancel an agreement as debtor and notify the creditor', async () => {
    const fakeAgreement = makeAgreement();
    fakeAgreement.debtorPartyConsent.acceptAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: fakeAgreement.debtorPartyId,
      agreementId: fakeAgreement.id,
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();

    expect(mockNotifyPartyUsecase.execute).toHaveBeenCalledWith({
      title: any(),
      content: `The debtor ${fakeAgreement.debtorPartyId} has canceled his part of the agreement.`,
      partyId: fakeAgreement.creditorPartyId,
    });
  });

  it('should return AgreementNotFoundError if agreement was not found with the provided partyId', async () => {
    const fakeAgreement = makeAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: 'efb26144-e2ea-4737-82e2-710877961d2e',
      agreementId: fakeAgreement.id,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });

  it('should return AgreementNotFoundError if agreement was not found with the provided agreementId', async () => {
    const fakeAgreement = makeAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: fakeAgreement.creditorPartyId,
      agreementId: '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });

  it('should return an error if cancelAgreement by the creditor party fails', async () => {
    const fakeAgreement = makeAgreement();
    fakeAgreement.creditorPartyConsent.cancelAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: fakeAgreement.creditorPartyId,
      agreementId: fakeAgreement.id,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DomainError);
  });

  it('should return an error if cancelAgreement by the debtor party fails', async () => {
    const fakeAgreement = makeAgreement();
    fakeAgreement.debtorPartyConsent.cancelAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: fakeAgreement.debtorPartyId,
      agreementId: fakeAgreement.id,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(DomainError);
  });

  it('should return an error if sending notification fails', async () => {
    const fakeAgreement = makeAgreement();

    fakeAgreementRepository.agreements.push(fakeAgreement);
    jest.spyOn(mockNotifyPartyUsecase, 'execute').mockResolvedValueOnce(left(new MockBaseError()));

    const sut = await cancelAnAgreementUsecase.execute({
      partyId: fakeAgreement.debtorPartyId,
      agreementId: fakeAgreement.id,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(BaseError);
  });
});
