import { Entity } from '@core/domain/helpers/entity';
import { Replace } from '@core/domain/helpers/replace';
import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';

import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { PartyConsent, PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';
import { CreditorAndDebtorCannotBeTheSameError } from '@agreements/domain/errors/creditor-and-debtor-cannot-be-the-same-error';

export type AgreementProps = {
  debtorPartyId: string;
  creditorPartyId: string;
  createdAt: Date;
  owingItem: OwingItem;
  debtorPartyConsent: PartyConsent;
  creditorPartyConsent: PartyConsent;
};

export class Agreement extends Entity<AgreementProps> {
  public get creditorPartyId(): string {
    return this.props.creditorPartyId;
  }

  public get debtorPartyId(): string {
    return this.props.debtorPartyId;
  }

  public get owingItem(): OwingItem {
    return this.props.owingItem;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get creditorPartyConsent(): PartyConsent {
    return this.props.creditorPartyConsent;
  }

  public get debtorPartyConsent(): PartyConsent {
    return this.props.debtorPartyConsent;
  }

  public static create(
    props: Replace<
      AgreementProps,
      { createdAt?: Date; debtorPartyConsent?: PartyConsent; creditorPartyConsent?: PartyConsent }
    >,
    id?: string,
  ): Either<DomainError, Agreement> {
    if (props.creditorPartyId === props.debtorPartyId) {
      const error = new CreditorAndDebtorCannotBeTheSameError(
        'Creditor and debtor parties cannot be the same',
      );
      return left(error);
    }

    const agreement = new Agreement(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        debtorPartyConsent:
          props.debtorPartyConsent ??
          (PartyConsent.create({ status: PartyConsentStatus.PENDING }).value as PartyConsent),
        creditorPartyConsent:
          props.creditorPartyConsent ??
          (PartyConsent.create({ status: PartyConsentStatus.PENDING }).value as PartyConsent),
      },
      id,
    );
    return right(agreement);
  }
}
