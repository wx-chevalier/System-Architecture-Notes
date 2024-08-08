import { BaseError } from '@core/domain/errors/base-error';

export class MockBaseError extends BaseError {
  public constructor() {
    super('MockBaseError', 'MockBaseError', 'MockBaseError');
  }
}
