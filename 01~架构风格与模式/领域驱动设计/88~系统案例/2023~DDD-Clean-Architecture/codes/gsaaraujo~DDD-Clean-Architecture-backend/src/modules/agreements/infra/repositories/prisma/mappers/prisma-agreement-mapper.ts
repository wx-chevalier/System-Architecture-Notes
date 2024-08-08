import { Agreement as AgreementORM, AgreementProfile as AgreementProfileORM } from '@prisma/client';

import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';

export class PrismaAgreementMapper {
  public static toDomain(
    agreementORM: AgreementORM,
    agreementProfileORM: AgreementProfileORM,
  ): Agreement {
    return Agreement.create(
      {
        debtorPartyId: agreementProfileORM.debtorProfileId,
        creditorPartyId: agreementProfileORM.creditorProfileId,
        createdAt: agreementORM.madeAt,
        owingItem: OwingItem.create({
          amount: agreementORM.amount,
          isCurrency: agreementORM.isCurrency,
        }).value as OwingItem,
        debtorPartyConsent: PartyConsent.create({
          status: this.partyStatusToDomain(agreementORM.debtorStatus),
        }).value as PartyConsent,
        creditorPartyConsent: PartyConsent.create({
          status: this.partyStatusToDomain(agreementORM.creditorStatus),
        }).value as PartyConsent,
      },
      agreementORM.id,
    ).value as Agreement;
  }

  public static toPersistence(agreement: Agreement): AgreementORM {
    return {
      id: agreement.id,
      madeAt: agreement.createdAt,
      amount: agreement.owingItem.amount,
      isCurrency: agreement.owingItem.isCurrency,
      description: agreement.owingItem.description,
      debtorStatus: agreement.debtorPartyConsent.status,
      creditorStatus: agreement.creditorPartyConsent.status,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    };
  }

  private static partyStatusToDomain(raw: any): PartyConsentStatus {
    switch (raw) {
      case 'ACCEPTED':
        return PartyConsentStatus.ACCEPTED;

      case 'CANCELED':
        return PartyConsentStatus.CANCELED;

      case 'DENIED':
        return PartyConsentStatus.DENIED;

      case 'PAID':
        return PartyConsentStatus.PAID;

      case 'PENDING':
        return PartyConsentStatus.PENDING;

      default:
        return PartyConsentStatus.PENDING;
    }
  }
}
