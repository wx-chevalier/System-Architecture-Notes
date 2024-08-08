export type PartyDTO = {
  id: string;
  registrationToken: string;
};

export interface IPartyRepository {
  exists(id: string): Promise<boolean>;
  findOneRegistrationTokenByPartyId(partyId: string): Promise<string | null>;
}
