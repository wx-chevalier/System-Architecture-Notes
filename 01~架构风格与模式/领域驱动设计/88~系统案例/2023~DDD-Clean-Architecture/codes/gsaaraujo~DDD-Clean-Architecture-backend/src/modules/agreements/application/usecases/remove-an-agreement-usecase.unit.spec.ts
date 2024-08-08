import { makeAgreement } from '@agreements/domain/tests/factories/agreement-factory';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';
import { RemoveAnAgreementUsecase } from '@agreements/application/usecases/remove-an-agreement-usecase';
import { CannotRemoveAgreementError } from '@agreements/application/errors/cannot-remove-agreement-error';

import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('remove-an-agreement-usecase', () => {
  let removeAnAgreementUsecase: RemoveAnAgreementUsecase;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    fakeAgreementRepository = new FakeAgreementRepository();
    removeAnAgreementUsecase = new RemoveAnAgreementUsecase(fakeAgreementRepository);
  });

  it('should remove agreement', async () => {
    const fakeAgreement = makeAgreement();
    fakeAgreementRepository.agreements = [fakeAgreement];

    const sut = await removeAnAgreementUsecase.execute({
      partyId: fakeAgreement.creditorPartyId,
      agreementId: fakeAgreement.id,
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeUndefined();
    expect(fakeAgreementRepository.agreements.length).toBe(0);
  });

  it('should return AgreementNotFoundError if agreement was not found by the provided id', async () => {
    const fakeAgreement = makeAgreement();
    fakeAgreementRepository.agreements = [fakeAgreement];

    const sut = await removeAnAgreementUsecase.execute({
      partyId: fakeAgreement.creditorPartyId,
      agreementId: '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });

  it('should return AgreementNotFoundError if agreement was not found by the provided partyId', async () => {
    const fakeAgreement = makeAgreement();
    fakeAgreementRepository.agreements = [fakeAgreement];

    const sut = await removeAnAgreementUsecase.execute({
      partyId: 'efb26144-e2ea-4737-82e2-710877961d2e',
      agreementId: fakeAgreement.id,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(AgreementNotFoundError);
  });

  it('should return CannotRemoveAgreementError if both creditor and debtor consent of the agreement are not pending', async () => {
    const fakeAgreement = makeAgreement();
    fakeAgreement.creditorPartyConsent.acceptAgreement();
    fakeAgreement.debtorPartyConsent.acceptAgreement();

    fakeAgreementRepository.agreements = [fakeAgreement];

    const sut = await removeAnAgreementUsecase.execute({
      partyId: fakeAgreement.creditorPartyId,
      agreementId: fakeAgreement.id,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CannotRemoveAgreementError);
  });
});
