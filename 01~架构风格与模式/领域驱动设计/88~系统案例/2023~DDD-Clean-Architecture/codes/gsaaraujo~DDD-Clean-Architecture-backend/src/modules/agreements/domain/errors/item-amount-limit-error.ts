import { DomainError } from '@core/domain/errors/domain-error';

export class ItemAmountLimitError extends DomainError {
  public constructor(message: string) {
    super('ItemAmountLimitError', message);
  }
}
