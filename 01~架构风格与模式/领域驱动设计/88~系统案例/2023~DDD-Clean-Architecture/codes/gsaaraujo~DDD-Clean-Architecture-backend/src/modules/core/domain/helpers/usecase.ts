import { Either } from '@core/domain/helpers/either';
import { DomainError } from '@core/domain/errors/domain-error';
import { ApplicationError } from '@core/domain/errors/application-error';

export interface Usecase<I, O> {
  execute(input?: I): Promise<Either<DomainError | ApplicationError, O>>;
}
