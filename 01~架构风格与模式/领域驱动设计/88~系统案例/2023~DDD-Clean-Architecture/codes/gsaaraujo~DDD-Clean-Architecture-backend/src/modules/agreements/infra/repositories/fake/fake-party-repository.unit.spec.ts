import { makeParty } from '@agreements/domain/tests/factories/party-factory';

import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';

describe('fake-party-repository', () => {
  let fakePartyRepository: FakePartyRepository;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
  });

  describe('exists', () => {
    it('should return true if party does exist with the given id', async () => {
      const party = makeParty();
      fakePartyRepository.parties.push(party);

      const sut = await fakePartyRepository.exists(party.id);

      expect(sut).toBeTruthy();
    });

    it('should return false if party does not exist with the given id', async () => {
      const party = makeParty();
      fakePartyRepository.parties.push(party);

      const sut = await fakePartyRepository.exists('501f2325-755d-4195-b680-c4cc869617a8');

      expect(sut).toBeFalsy();
    });
  });

  describe('findOneRegistrationTokenByPartyId', () => {
    it('should find and return the registration token with the given partyId', async () => {
      const party = makeParty();
      fakePartyRepository.parties.push(party);

      const sut = await fakePartyRepository.findOneRegistrationTokenByPartyId(party.id);

      expect(sut).toBe(party.registrationToken);
    });

    it('should return null if no registration token was found with the given partyId', async () => {
      const sut = await fakePartyRepository.findOneRegistrationTokenByPartyId(
        '34544687-2074-4c57-9ac6-b87946f0df45',
      );

      expect(sut).toBeNull();
    });
  });
});
