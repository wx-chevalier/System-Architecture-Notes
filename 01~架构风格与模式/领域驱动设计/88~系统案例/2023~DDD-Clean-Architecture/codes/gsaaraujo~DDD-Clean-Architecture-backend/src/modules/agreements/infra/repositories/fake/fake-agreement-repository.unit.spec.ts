import { makeAgreement } from '@agreements/domain/tests/factories/agreement-factory';

import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';

import { FakeAgreementRepository } from '@agreements/infra/repositories/fake/fake-agreement-repository';

describe('fake-agreement-repository', () => {
  let fakeAgreementRepository: FakeAgreementRepository;

  beforeEach(() => {
    fakeAgreementRepository = new FakeAgreementRepository();
  });

  describe('exists', () => {
    it('should return true if the agreement exists with given the id', async () => {
      const fakeAgreement = makeAgreement();
      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.exists(fakeAgreement.id);

      expect(sut).toBeTruthy();
    });

    it('should return false if the agreement does not exist with the given id', async () => {
      const sut = await fakeAgreementRepository.exists('9f3a766c-eb64-4b6b-91a1-36b4b501476e');

      expect(sut).toBeFalsy();
    });
  });

  describe('create', () => {
    it('should persist and return the agreement', async () => {
      const fakeAgreement = makeAgreement();

      const sut = await fakeAgreementRepository.create(fakeAgreement);

      expect(sut).toStrictEqual(fakeAgreement);
      expect(fakeAgreementRepository.agreements.length).toBe(1);
    });
  });

  describe('findOneById', () => {
    it('should find and return an agreement with the given id', async () => {
      const fakeAgreement = makeAgreement();
      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.findOneById(fakeAgreement.id);

      expect(sut).toStrictEqual(fakeAgreement);
    });

    it('should return null if no agreement was found with the given id', async () => {
      const sut = await fakeAgreementRepository.findOneById('9f3a766c-eb64-4b6b-91a1-36b4b501476e');

      expect(sut).toBeNull();
    });
  });

  describe('findAllById', () => {
    it('should find and return all agreements with the given partyId', async () => {
      const fakeAgreement = makeAgreement();
      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.findAllByPartyId(fakeAgreement.creditorPartyId);

      expect(sut).toStrictEqual([fakeAgreement]);
    });

    it('should return a empty list of agreements if no agreement was found with the given partyId', async () => {
      const sut = await fakeAgreementRepository.findAllByPartyId(
        '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
      );

      expect(sut).toStrictEqual([]);
    });
  });

  describe('findOneByIdAndPartyId', () => {
    it('should find and return an agreement with the given id and partyId', async () => {
      const fakeAgreement = makeAgreement();
      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.findOneByIdAndPartyId(
        fakeAgreement.id,
        fakeAgreement.creditorPartyId,
      );

      expect(sut).toStrictEqual(fakeAgreement);
    });

    it('should return null if no agreement was found with the given id and partyId', async () => {
      const sut = await fakeAgreementRepository.findOneByIdAndPartyId(
        '9f3a766c-eb64-4b6b-91a1-36b4b501476e',
        '331c6804-cd7d-420e-b8b8-50fcc5201e32',
      );

      expect(sut).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the updated agreement with the given agreement', async () => {
      const fakeAgreement = Agreement.create(
        {
          debtorPartyId: 'any_debtor_party_id',
          creditorPartyId: 'any_creditor_party_id',
          owingItem: OwingItem.create({
            amount: 2,
            isCurrency: false,
          }).value as OwingItem,
        },
        '5b8c08a4-3688-4e5b-a518-2e7747ebaa5a',
      ).value as Agreement;

      const fakeUpdatedAgreement = Agreement.create(
        {
          debtorPartyId: 'any_debtor_party_id',
          creditorPartyId: 'any_creditor_party_id',
          owingItem: OwingItem.create({
            amount: 500,
            isCurrency: true,
          }).value as OwingItem,
        },
        '5b8c08a4-3688-4e5b-a518-2e7747ebaa5a',
      ).value as Agreement;

      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.update(fakeUpdatedAgreement);

      expect(sut).toStrictEqual(fakeUpdatedAgreement);
      expect(fakeAgreementRepository.agreements.length).toBe(1);
      expect(fakeAgreementRepository.agreements[0]).toStrictEqual(fakeUpdatedAgreement);
    });
  });

  describe('delete', () => {
    it('should delete a agreement with the given id', async () => {
      const fakeAgreement = makeAgreement();
      fakeAgreementRepository.agreements.push(fakeAgreement);

      const sut = await fakeAgreementRepository.delete(fakeAgreement.id);

      expect(sut).toBeUndefined();
      expect(fakeAgreementRepository.agreements.length).toBe(0);
    });
  });
});
