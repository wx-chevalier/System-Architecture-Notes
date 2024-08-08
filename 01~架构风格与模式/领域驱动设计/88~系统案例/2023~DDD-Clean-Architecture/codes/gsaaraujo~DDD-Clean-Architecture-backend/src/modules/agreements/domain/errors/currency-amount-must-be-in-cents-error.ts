import { DomainError } from '@core/domain/errors/domain-error';

export class CurrencyAmountMustBeInCentsError extends DomainError {
  public constructor(message: string) {
    super('CurrencyAmountMustBeInCentsError', message);
  }
}
