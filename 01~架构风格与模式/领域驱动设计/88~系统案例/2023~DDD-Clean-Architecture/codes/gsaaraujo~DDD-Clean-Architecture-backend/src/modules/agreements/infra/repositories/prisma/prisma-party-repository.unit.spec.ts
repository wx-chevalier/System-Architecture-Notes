import { PrismaClient } from '@prisma/client';

import { MockContext, Context, createMockContext } from '@core/tests/prisma/context';

import { makeProfileORM } from '@agreements/tests/factories/profile-orm-factory';
import { makeUserDeviceTokenORM } from '@agreements/tests/factories/user-device-token-orm-factory';

import { PrismaPartyRepository } from '@agreements/infra/repositories/prisma/prisma-party-repository';

describe('prisma-party-repository', () => {
  let prismaPartyRepository: PrismaPartyRepository;

  let context: Context;
  let mockContext: MockContext;
  let mockPrismaClient: PrismaClient;

  beforeEach(() => {
    mockContext = createMockContext();
    context = mockContext as unknown as Context;
    mockPrismaClient = context.prisma;

    prismaPartyRepository = new PrismaPartyRepository(mockPrismaClient);
  });

  describe('exists', () => {
    it('should return true if the party exists with the given id', async () => {
      const profileORM = makeProfileORM();

      jest.spyOn(mockPrismaClient.profile, 'findUnique').mockResolvedValueOnce(profileORM);

      const sut = await prismaPartyRepository.exists('any_user_id');

      expect(sut).toBeTruthy();
    });

    it('should return false if the party does not exist with the given id', async () => {
      jest.spyOn(mockPrismaClient.profile, 'findUnique').mockResolvedValueOnce(null);

      const sut = await prismaPartyRepository.exists('any_user_id');

      expect(sut).toBeFalsy();
    });
  });

  describe('findOneRegistrationTokenByPartyId', () => {
    it('should return a registration token with the given id', async () => {
      const userDeviceTokenORM = makeUserDeviceTokenORM();

      jest
        .spyOn(mockPrismaClient.userDeviceToken, 'findUnique')
        .mockResolvedValueOnce(userDeviceTokenORM);

      const sut = await prismaPartyRepository.findOneRegistrationTokenByPartyId('any_user_id');

      expect(sut).toBe(userDeviceTokenORM.token);
    });

    it('should return null if no token was found with the given id', async () => {
      jest.spyOn(mockPrismaClient.userDeviceToken, 'findUnique').mockResolvedValueOnce(null);

      const sut = await prismaPartyRepository.findOneRegistrationTokenByPartyId('any_user_id');

      expect(sut).toBeNull();
    });
  });
});
