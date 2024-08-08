import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { Agreement, AgreementProps } from '@agreements/domain/entities/agreement';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';

type MakeAgreementProps = Partial<AgreementProps>;

export const makeAgreement = (id?: string, props?: MakeAgreementProps): Agreement => {
  return Agreement.create(
    {
      debtorPartyId: 'b8f7f5e6-7cc2-42f7-bc62-dd86ed78e3f5',
      creditorPartyId: '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      createdAt: new Date('2023-01-01'),
      debtorPartyConsent: PartyConsent.create({
        status: PartyConsentStatus.PENDING,
        ...props,
      }).value as PartyConsent,
      creditorPartyConsent: PartyConsent.create({
        status: PartyConsentStatus.PENDING,
        ...props,
      }).value as PartyConsent,
      owingItem: OwingItem.create({
        amount: 2,
        isCurrency: false,
      }).value as OwingItem,
      ...props,
    },
    id ?? 'deb039f6-b48e-41ba-9aeb-59d280691255',
  ).value as Agreement;
};
