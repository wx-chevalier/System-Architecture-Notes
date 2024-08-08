import { DomainError } from '@core/domain/errors/domain-error';

export class CurrentStatusMustBeAcceptedError extends DomainError {
  public constructor(message: string) {
    super('CurrentStatusMustBeAcceptedError', message);
  }
}
