import { BaseError } from '@core/domain/errors/base-error';

export abstract class ApplicationError extends BaseError {
  protected constructor(name: string, message: string) {
    super('ApplicationError', name, message);
  }
}
