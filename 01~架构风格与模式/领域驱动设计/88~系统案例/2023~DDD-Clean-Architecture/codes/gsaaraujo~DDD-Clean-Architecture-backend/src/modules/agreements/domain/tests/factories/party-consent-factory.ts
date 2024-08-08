import {
  PartyConsent,
  PartyConsentProps,
  PartyConsentStatus,
} from '@agreements/domain/value-objects/party-consent';

type MakePartyConsentProps = Partial<PartyConsentProps>;

export const makePartyConsent = (props?: MakePartyConsentProps): PartyConsent => {
  return PartyConsent.create({
    status: PartyConsentStatus.PENDING,
    ...props,
  }).value as PartyConsent;
};
