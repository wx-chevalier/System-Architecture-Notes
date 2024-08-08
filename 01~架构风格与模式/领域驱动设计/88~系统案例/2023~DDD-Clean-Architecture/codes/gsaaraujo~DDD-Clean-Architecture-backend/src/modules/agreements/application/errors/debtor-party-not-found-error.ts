import { ApplicationError } from '@core/domain/errors/application-error';

export class DebtorPartyNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('DebtorPartyNotFoundError', message);
  }
}
