import { DomainError } from '@core/domain/errors/domain-error';

export class MockDomainError extends DomainError {
  public constructor() {
    super('MockDomainError', 'MockDomainError');
  }
}
