import { DomainError } from '@core/domain/errors/domain-error';

export class CreditorAndDebtorCannotBeTheSameError extends DomainError {
  public constructor(message: string) {
    super('CreditorAndDebtorCannotBeTheSameError', message);
  }
}
