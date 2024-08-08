import { PrismaClient } from '@prisma/client';

import { IPartyRepository } from '@agreements/application/repositories/party-repository';

export class PrismaPartyRepository implements IPartyRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  async exists(id: string): Promise<boolean> {
    const party = await this.prismaClient.profile.findUnique({
      where: { id },
    });

    return !!party;
  }

  async findOneRegistrationTokenByPartyId(partyId: string): Promise<string | null> {
    const userDeviceToken = await this.prismaClient.userDeviceToken.findUnique({
      where: { id: partyId },
    });

    if (!userDeviceToken) return null;
    return userDeviceToken.token;
  }
}
