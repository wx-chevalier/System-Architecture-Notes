import { ApplicationError } from '@core/domain/errors/application-error';

export class RecipientPartyNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('RecipientPartyNotFoundError', message);
  }
}
