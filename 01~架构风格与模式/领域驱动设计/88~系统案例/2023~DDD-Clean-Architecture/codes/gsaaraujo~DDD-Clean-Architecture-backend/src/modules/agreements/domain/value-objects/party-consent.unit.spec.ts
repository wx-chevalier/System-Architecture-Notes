import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';
import { CurrentStatusMustBePendingError } from '@agreements/domain/errors/current-status-must-be-pending-error';
import { CurrentStatusMustBeAcceptedError } from '@agreements/domain/errors/current-status-must-be-accepted-error';

describe('PartyConsent', () => {
  it('should create a party consent', () => {
    const sut = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyConsent);
  });

  it('should accept the agreement', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.PENDING })
      .value as PartyConsent;

    const sut = fakePartyConsent.acceptAgreement();

    expect(sut.isRight()).toBeTruthy();
    expect(fakePartyConsent.status).toStrictEqual(PartyConsentStatus.ACCEPTED);
  });

  it('should deny the agreement', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.PENDING })
      .value as PartyConsent;

    const sut = fakePartyConsent.denyAgreement();

    expect(sut.isRight()).toBeTruthy();
    expect(fakePartyConsent.status).toStrictEqual(PartyConsentStatus.DENIED);
  });

  it('should cancel the agreement', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED })
      .value as PartyConsent;

    const sut = fakePartyConsent.cancelAgreement();

    expect(sut.isRight()).toBeTruthy();
    expect(fakePartyConsent.status).toStrictEqual(PartyConsentStatus.CANCELED);
  });

  it('should pay the agreement', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED })
      .value as PartyConsent;

    const sut = fakePartyConsent.payAgreement();

    expect(sut.isRight()).toBeTruthy();
    expect(fakePartyConsent.status).toStrictEqual(PartyConsentStatus.PAID);
  });

  it('should return CurrentStatusMustBePendingError when accepting the agreement and the current PartyConsentStatus is not PENDING', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED })
      .value as PartyConsent;

    const sut = fakePartyConsent.acceptAgreement();

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CurrentStatusMustBePendingError);
  });

  it('should return CurrentStatusMustBePendingError when denying the agreement and the current PartyConsentStatus is not PENDING', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.ACCEPTED })
      .value as PartyConsent;

    const sut = fakePartyConsent.denyAgreement();

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CurrentStatusMustBePendingError);
  });

  it('should return CurrentStatusMustBeAcceptedError when canceling the agreement and the current PartyConsentStatus is not ACCEPTED', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.PENDING })
      .value as PartyConsent;

    const sut = fakePartyConsent.cancelAgreement();

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);
  });

  it('should return CurrentStatusMustBeAcceptedError when paying the agreement and the current PartyConsentStatus is not ACCEPTED', () => {
    const fakePartyConsent = PartyConsent.create({ status: PartyConsentStatus.PENDING })
      .value as PartyConsent;

    const sut = fakePartyConsent.payAgreement();

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CurrentStatusMustBeAcceptedError);
  });
});
