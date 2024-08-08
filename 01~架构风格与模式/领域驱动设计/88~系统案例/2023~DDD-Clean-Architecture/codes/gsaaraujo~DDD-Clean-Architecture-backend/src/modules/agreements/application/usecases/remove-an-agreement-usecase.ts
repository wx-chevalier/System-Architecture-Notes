import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';
import { ApplicationError } from '@core/domain/errors/application-error';

import { PartyConsentStatus } from '@agreements/domain/value-objects/party-consent';
import {
  IRemoveAnAgreementUsecase,
  RemoveAnAgreementUsecaseInput,
  RemoveAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/remove-an-agreement-usecase';

import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';
import { CannotRemoveAgreementError } from '@agreements/application/errors/cannot-remove-agreement-error';

export class RemoveAnAgreementUsecase implements IRemoveAnAgreementUsecase {
  public constructor(private readonly agreementRepository: IAgreementRepository) {}

  async execute(
    input: RemoveAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, RemoveAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findOneByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    if (
      agreement.debtorPartyConsent.status !== PartyConsentStatus.PENDING ||
      agreement.creditorPartyConsent.status !== PartyConsentStatus.PENDING
    ) {
      const error = new CannotRemoveAgreementError('Both agreements must be pending to be removed');
      return left(error);
    }

    await this.agreementRepository.delete(input.agreementId);
    return right(undefined);
  }
}
