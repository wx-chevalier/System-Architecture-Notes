import { DomainError } from '@core/domain/errors/domain-error';

export class NotificationHasAlreadyBeenReadError extends DomainError {
  public constructor(message: string) {
    super('NotificationHasAlreadyBeenReadError', message);
  }
}
