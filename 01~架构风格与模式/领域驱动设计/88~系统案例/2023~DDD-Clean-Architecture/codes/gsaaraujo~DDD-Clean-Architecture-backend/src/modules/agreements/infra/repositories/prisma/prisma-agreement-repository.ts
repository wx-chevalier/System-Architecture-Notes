import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

import { Agreement } from '@agreements/domain/entities/agreement';

import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';

import { PrismaAgreementMapper } from '@agreements/infra/repositories/prisma/mappers/prisma-agreement-mapper';

export class PrismaAgreementRepository implements IAgreementRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  async exists(id: string): Promise<boolean> {
    const agreementORM = await this.prismaClient.agreement.findUnique({
      where: { id },
    });

    return !!agreementORM;
  }

  async create(agreement: Agreement): Promise<Agreement> {
    const [agreementORM, agreementProfileORM] = await this.prismaClient.$transaction([
      this.prismaClient.agreement.create({
        data: PrismaAgreementMapper.toPersistence(agreement),
      }),
      this.prismaClient.agreementProfile.create({
        data: {
          id: randomUUID(),
          agreementId: agreement.id,
          debtorProfileId: agreement.debtorPartyId,
          creditorProfileId: agreement.creditorPartyId,
        },
      }),
    ]);

    return PrismaAgreementMapper.toDomain(agreementORM, agreementProfileORM);
  }

  async update(agreement: Agreement): Promise<Agreement> {
    const [agreementORM, agreementProfileORM] = await this.prismaClient.$transaction([
      this.prismaClient.agreement.update({
        where: { id: agreement.id },
        data: PrismaAgreementMapper.toPersistence(agreement),
      }),
      this.prismaClient.agreementProfile.update({
        where: { agreementId: agreement.id },
        data: {
          agreementId: agreement.id,
          debtorProfileId: agreement.debtorPartyId,
          creditorProfileId: agreement.creditorPartyId,
        },
      }),
    ]);

    return PrismaAgreementMapper.toDomain(agreementORM, agreementProfileORM);
  }

  async findOneById(id: string): Promise<Agreement | null> {
    const agreementORM = await this.prismaClient.agreement.findUnique({
      where: { id },
    });

    if (!agreementORM) return null;

    const agreementProfileORM = await this.prismaClient.agreementProfile.findUnique({
      where: { id: agreementORM.id },
    });

    if (!agreementProfileORM) return null;

    return PrismaAgreementMapper.toDomain(agreementORM, agreementProfileORM);
  }

  async findOneByIdAndPartyId(id: string, partyId: string): Promise<Agreement | null> {
    const agreementORM = await this.prismaClient.agreement.findUnique({
      where: { id },
    });

    if (!agreementORM) return null;

    const agreementProfileORM = await this.prismaClient.agreementProfile.findFirst({
      where: {
        OR: [{ debtorProfileId: partyId }, { creditorProfileId: partyId }],
      },
    });

    if (!agreementProfileORM) return null;

    return PrismaAgreementMapper.toDomain(agreementORM, agreementProfileORM);
  }

  async findAllByPartyId(partyId: string): Promise<Agreement[]> {
    const agreementProfileORMs = await this.prismaClient.agreementProfile.findMany({
      where: {
        OR: [{ debtorProfileId: partyId }, { creditorProfileId: partyId }],
      },
    });

    const agreementORMs = await Promise.all(
      agreementProfileORMs.map((agreementProfileORM) =>
        this.prismaClient.agreement.findUnique({
          where: { id: agreementProfileORM.agreementId },
        }),
      ),
    );

    const agreements: Agreement[] = [];

    for (const agreementProfileORM of agreementProfileORMs) {
      const agreementORM = agreementORMs.find(
        (agreementORM) => agreementORM?.id === agreementProfileORM.agreementId,
      );

      if (agreementORM !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        agreements.push(PrismaAgreementMapper.toDomain(agreementORM!, agreementProfileORM));
      }
    }

    return agreements;
  }

  async delete(id: string): Promise<void> {
    await this.prismaClient.agreement.delete({ where: { id } });
  }
}
