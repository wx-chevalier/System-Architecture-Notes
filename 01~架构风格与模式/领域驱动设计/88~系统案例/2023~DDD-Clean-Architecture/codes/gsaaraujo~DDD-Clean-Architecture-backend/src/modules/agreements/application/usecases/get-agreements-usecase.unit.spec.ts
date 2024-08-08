import { makeParty } from '@agreements/domain/tests/factories/party-factory';
import { makeAgreement } from '@agreements/domain/tests/factories/agreement-factory';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { GetAgreementsUsecase } from '@agreements/application/usecases/get-agreements-usecase';

import { FakePartyRepository } from '@agreements/infra/repositories/fake/fake-party-repository';
import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('get-agreements-usecase', () => {
  let getAgreementsUsecase: GetAgreementsUsecase;
  let fakePartyRepository: FakePartyRepository;
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    fakePartyRepository = new FakePartyRepository();
    fakeAgreementRepository = new FakeAgreementRepository();

    getAgreementsUsecase = new GetAgreementsUsecase(fakePartyRepository, fakeAgreementRepository);
  });

  it('should get agreements', async () => {
    const fakeAgreement = makeAgreement();
    const fakeParty = makeParty({ id: fakeAgreement.creditorPartyId });

    fakeAgreementRepository.agreements.push(fakeAgreement);
    fakePartyRepository.parties.push(fakeParty);

    const sut = await getAgreementsUsecase.execute({
      partyId: fakeAgreement.creditorPartyId,
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual([fakeAgreement]);
  });

  it('should get a empty list of agreements', async () => {
    const fakeParty = makeParty({ id: '61fe30ca-8a52-43ec-8331-39cb9bb6af8a' });
    fakePartyRepository.parties.push(fakeParty);

    const sut = await getAgreementsUsecase.execute({
      partyId: '61fe30ca-8a52-43ec-8331-39cb9bb6af8a',
    });

    expect(sut.isRight()).toBeTruthy();
    expect(sut.value).toStrictEqual([]);
  });

  it('shold return PartyNotFoundError if party was not found', async () => {
    const sut = await getAgreementsUsecase.execute({
      partyId: '6760eff7-9e96-44c6-828f-34e490a7df27',
    });

    expect(sut.isLeft()).toBeTruthy();
    expect(sut.value).toBeInstanceOf(PartyNotFoundError);
  });
});
