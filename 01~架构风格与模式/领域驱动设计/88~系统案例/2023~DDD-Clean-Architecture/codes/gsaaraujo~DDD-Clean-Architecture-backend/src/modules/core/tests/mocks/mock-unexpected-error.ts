import { BaseError } from '@core/domain/errors/base-error';

export class MockUnexpectedError extends BaseError {
  public constructor() {
    super('MockUnexpectedError', 'MockUnexpectedError', 'MockUnexpectedError');
  }
}
