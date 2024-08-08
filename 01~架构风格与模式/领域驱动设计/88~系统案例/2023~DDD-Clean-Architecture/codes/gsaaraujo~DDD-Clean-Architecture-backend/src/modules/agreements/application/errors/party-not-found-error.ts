import { ApplicationError } from '@core/domain/errors/application-error';

export class PartyNotFoundError extends ApplicationError {
  public constructor(message: string) {
    super('PartyNotFoundError', message);
  }
}
