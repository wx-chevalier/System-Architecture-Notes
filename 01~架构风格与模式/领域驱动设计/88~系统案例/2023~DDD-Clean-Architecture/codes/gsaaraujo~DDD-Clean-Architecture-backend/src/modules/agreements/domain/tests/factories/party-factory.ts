import { PartyDTO } from '@agreements/application/repositories/party-repository';

type MakePartyDTO = Partial<PartyDTO>;

export const makeParty = (props?: MakePartyDTO): PartyDTO => {
  return {
    id: '6b78cf4a-8c26-4a29-8bb8-3384fbf7bfae',
    registrationToken: 'J48F7HKD984OK5MFI49O3K9GOLDKT93P32L',
    ...props,
  };
};
