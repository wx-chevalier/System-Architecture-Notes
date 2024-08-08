import { IPartyRepository, PartyDTO } from '@agreements/application/repositories/party-repository';

export class FakePartyRepository implements IPartyRepository {
  public parties: PartyDTO[] = [];

  async exists(id: string): Promise<boolean> {
    const party = this.parties.find((party) => party.id === id);
    return !!party;
  }

  async create(partyDTO: PartyDTO): Promise<PartyDTO> {
    this.parties.push(partyDTO);
    return partyDTO;
  }

  async findOneRegistrationTokenByPartyId(partyId: string): Promise<string | null> {
    const party = this.parties.find((party) => party.id === partyId);

    if (!party) return null;
    return party.registrationToken;
  }
}
