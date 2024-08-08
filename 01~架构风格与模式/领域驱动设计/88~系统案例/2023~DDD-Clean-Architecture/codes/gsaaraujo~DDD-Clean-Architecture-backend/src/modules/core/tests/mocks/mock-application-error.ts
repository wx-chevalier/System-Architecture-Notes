import { ApplicationError } from '@core/domain/errors/application-error';

export class MockApplicationError extends ApplicationError {
  public constructor() {
    super('MockApplicationError', 'MockApplicationError');
  }
}
