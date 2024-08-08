import { DomainError } from '@core/domain/errors/domain-error';

export class CharactersLimitError extends DomainError {
  public constructor(message: string) {
    super('CharactersLimitError', message);
  }
}
