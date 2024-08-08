import { ApplicationError } from '@core/domain/errors/application-error';

export class CreditorPartyNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('CreditorPartyNotFoundError', message);
  }
}
