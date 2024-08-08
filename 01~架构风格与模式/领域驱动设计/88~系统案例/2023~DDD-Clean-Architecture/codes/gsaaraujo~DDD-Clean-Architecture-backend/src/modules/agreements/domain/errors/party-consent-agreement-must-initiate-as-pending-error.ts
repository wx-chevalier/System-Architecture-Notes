import { DomainError } from '@core/domain/errors/domain-error';

export class PartyConsentAgreementMustInitiateAsPendingError extends DomainError {
  public constructor(message: string) {
    super('PartyConsentAgreementMustInitiateAsPendingError', message);
  }
}
