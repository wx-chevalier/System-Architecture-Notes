import { DomainError } from '@core/domain/errors/domain-error';
import { ValueObject } from '@core/domain/helpers/value-object';
import { Either, left, right } from '@core/domain/helpers/either';

import { CurrentStatusMustBePendingError } from '@agreements/domain/errors/current-status-must-be-pending-error';
import { CurrentStatusMustBeAcceptedError } from '@agreements/domain/errors/current-status-must-be-accepted-error';

export enum PartyConsentStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
  CANCELED = 'CANCELED',
  PAID = 'PAID',
}

export type PartyConsentProps = {
  status: PartyConsentStatus;
};

export class PartyConsent extends ValueObject<PartyConsentProps> {
  public get status(): PartyConsentStatus {
    return this.props.status;
  }

  public static create(props: PartyConsentProps): Either<DomainError, PartyConsent> {
    const partyConsent = new PartyConsent(props);
    return right(partyConsent);
  }

  public acceptAgreement(): Either<DomainError, void> {
    if (this.props.status !== PartyConsentStatus.PENDING) {
      const error = new CurrentStatusMustBePendingError(
        "To accept the agreement it must be in 'pending' status",
      );
      return left(error);
    }

    this.props.status = PartyConsentStatus.ACCEPTED;
    return right(undefined);
  }

  public denyAgreement(): Either<DomainError, void> {
    if (this.props.status !== PartyConsentStatus.PENDING) {
      const error = new CurrentStatusMustBePendingError(
        "To deny the agreement it must be in 'pending' status",
      );
      return left(error);
    }

    this.props.status = PartyConsentStatus.DENIED;
    return right(undefined);
  }

  public cancelAgreement(): Either<DomainError, void> {
    if (this.props.status !== PartyConsentStatus.ACCEPTED) {
      const error = new CurrentStatusMustBeAcceptedError(
        "To cancel the agreement it must be in 'accepted' status",
      );
      return left(error);
    }

    this.props.status = PartyConsentStatus.CANCELED;
    return right(undefined);
  }

  public payAgreement(): Either<DomainError, void> {
    if (this.props.status !== PartyConsentStatus.ACCEPTED) {
      const error = new CurrentStatusMustBeAcceptedError(
        "To cancel the agreement it must be in 'accepted' status",
      );
      return left(error);
    }

    this.props.status = PartyConsentStatus.PAID;
    return right(undefined);
  }
}
