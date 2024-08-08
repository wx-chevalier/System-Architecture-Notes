import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';
import { CreditorAndDebtorCannotBeTheSameError } from '@agreements/domain/errors/creditor-and-debtor-cannot-be-the-same-error';

describe('Agreement', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an agreement', () => {
    const sut = Agreement.create({
      debtorPartyId: 'any_debtor_party_id',
      creditorPartyId: 'any_creditor_party_id',
      owingItem: OwingItem.create({
        amount: 2,
        isCurrency: false,
      }).value as OwingItem,
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(Agreement);
  });

  it('should reconstitute an agreement', () => {
    const sut = Agreement.create(
      {
        debtorPartyId: 'any_debtor_party_id',
        creditorPartyId: 'any_creditor_party_id',
        owingItem: OwingItem.create({
          amount: 2,
          isCurrency: false,
        }).value as OwingItem,
        createdAt: new Date(),
        debtorPartyConsent: PartyConsent.create({ status: PartyConsentStatus.ACCEPTED })
          .value as PartyConsent,
        creditorPartyConsent: PartyConsent.create({ status: PartyConsentStatus.ACCEPTED })
          .value as PartyConsent,
      },
      '6fdd179e-030a-4caa-9f15-f35392efd894',
    );

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(Agreement);
    expect((sut.value as Agreement).id).toBe('6fdd179e-030a-4caa-9f15-f35392efd894');
  });

  it('should return CreditorAndDebtorCannotBeTheSameError if creditor and debtor are the same', () => {
    const sut = Agreement.create({
      debtorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      owingItem: OwingItem.create({
        amount: 2,
        isCurrency: false,
      }).value as OwingItem,
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(CreditorAndDebtorCannotBeTheSameError);
  });
});
