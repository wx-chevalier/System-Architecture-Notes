import { PrismaClient } from '@prisma/client';

import { Context, createMockContext, MockContext } from '@core/tests/prisma/context';

import { makeAgreementORM } from '@agreements/tests/factories/agreement-orm-factory';
import { makeAgreement } from '@agreements/domain/tests/factories/agreement-factory';
import { makeAgreementProfileORM } from '@agreements/tests/factories/agreement-profile-orm-factory';

import { Agreement } from '@agreements/domain/entities/agreement';

import { PrismaAgreementRepository } from '@agreements/infra/repositories/prisma/prisma-agreement-repository';

describe('prisma-agreement-repository', () => {
  let prismaAgreementRepository: PrismaAgreementRepository;

  let context: Context;
  let mockContext: MockContext;
  let mockPrismaClient: PrismaClient;

  beforeEach(() => {
    mockContext = createMockContext();
    context = mockContext as unknown as Context;
    mockPrismaClient = context.prisma;

    prismaAgreementRepository = new PrismaAgreementRepository(mockPrismaClient);
  });

  describe('exists', () => {
    it('should return true if the agreement exists with the given id', async () => {
      const agreementORM = makeAgreementORM();

      jest.spyOn(mockPrismaClient.agreement, 'findUnique').mockResolvedValueOnce(agreementORM);

      const sut = await prismaAgreementRepository.exists('any_agreement_id');

      expect(sut).toBeTruthy();
    });

    it('should return true if the agreement exists with the given id', async () => {
      jest.spyOn(mockPrismaClient.agreement, 'findUnique').mockResolvedValueOnce(null);

      const sut = await prismaAgreementRepository.exists('any_agreement_id');

      expect(sut).toBeFalsy();
    });
  });

  describe('create', () => {
    it('should persist and return an agreement', async () => {
      const agreement = makeAgreement();
      const agreementORM = makeAgreementORM();
      const agreementProfileORM = makeAgreementProfileORM();

      jest
        .spyOn(mockPrismaClient, '$transaction')
        .mockResolvedValueOnce([agreementORM, agreementProfileORM]);

      const sut = await prismaAgreementRepository.create(agreement);

      expect(sut).toBeInstanceOf(Agreement);
    });
  });

  describe('update', () => {
    it('should update and return an updated agreement', async () => {
      const agreement = makeAgreement();
      const agreementORM = makeAgreementORM();
      const agreementProfileORM = makeAgreementProfileORM();

      jest
        .spyOn(mockPrismaClient, '$transaction')
        .mockResolvedValueOnce([agreementORM, agreementProfileORM]);

      const sut = await prismaAgreementRepository.update(agreement);

      expect(sut).toBeInstanceOf(Agreement);
    });
  });

  describe('findOneById', () => {
    it('should return an agreement with the given agreement id', async () => {
      const agreementORM = makeAgreementORM();
      const agreementProfileORM = makeAgreementProfileORM();

      jest.spyOn(mockPrismaClient.agreement, 'findUnique').mockResolvedValueOnce(agreementORM);
      jest
        .spyOn(mockPrismaClient.agreementProfile, 'findUnique')
        .mockResolvedValueOnce(agreementProfileORM);

      const sut = await prismaAgreementRepository.findOneById('any_agreement_id');

      expect(sut).toBeInstanceOf(Agreement);
    });

    it('should return null if no agreement was found with the given agreement id', async () => {
      jest.spyOn(mockPrismaClient.agreement, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(mockPrismaClient.agreementProfile, 'findUnique').mockResolvedValueOnce(null);

      const sut = await prismaAgreementRepository.findOneById('any_agreement_id');

      expect(sut).toBeNull();
    });
  });

  describe('findOneByIdAndPartyId', () => {
    it('should return an agreement with the given agreement id and party id', async () => {
      const agreementORM = makeAgreementORM();
      const agreementProfileORM = makeAgreementProfileORM();

      jest.spyOn(mockPrismaClient.agreement, 'findUnique').mockResolvedValueOnce(agreementORM);
      jest
        .spyOn(mockPrismaClient.agreementProfile, 'findFirst')
        .mockResolvedValueOnce(agreementProfileORM);

      const sut = await prismaAgreementRepository.findOneByIdAndPartyId(
        'any_agreement_id',
        'any_party_id',
      );

      expect(sut).toBeInstanceOf(Agreement);
    });

    it('should return null if no agreement was found with the given agreement id and party id', async () => {
      jest.spyOn(mockPrismaClient.agreement, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(mockPrismaClient.agreementProfile, 'findFirst').mockResolvedValueOnce(null);

      const sut = await prismaAgreementRepository.findOneByIdAndPartyId(
        'any_agreement_id',
        'any_party_id',
      );

      expect(sut).toBeNull();
    });
  });

  describe('findAllByPartyId', () => {
    it('should return a list of agreement with the given party id', async () => {
      const agreement = makeAgreement();
      const agreementORM = makeAgreementORM({ id: agreement.id });
      const agreementProfileORM = makeAgreementProfileORM({
        agreementId: agreement.id,
        debtorProfileId: agreement.debtorPartyId,
        creditorProfileId: agreement.creditorPartyId,
      });

      jest.spyOn(mockPrismaClient.agreement, 'findUnique').mockResolvedValueOnce(agreementORM);
      jest
        .spyOn(mockPrismaClient.agreementProfile, 'findMany')
        .mockResolvedValueOnce([agreementProfileORM]);

      const sut = await prismaAgreementRepository.findAllByPartyId('any_party_id');

      expect(sut).toStrictEqual([agreement]);
    });

    it('should return a empty list with the given party id', async () => {
      jest.spyOn(mockPrismaClient.agreement, 'findUnique').mockResolvedValueOnce(null);
      jest.spyOn(mockPrismaClient.agreementProfile, 'findMany').mockResolvedValueOnce([]);

      const sut = await prismaAgreementRepository.findAllByPartyId('any_party_id');

      expect(sut).toStrictEqual([]);
    });
  });

  describe('delete', () => {
    it('should return void with the given party agreement id', async () => {
      const agreementORM = makeAgreementORM();

      jest.spyOn(mockPrismaClient.agreement, 'delete').mockResolvedValueOnce(agreementORM);

      const sut = await prismaAgreementRepository.delete('any_party_id');

      expect(sut).toBeUndefined();
    });
  });
});
