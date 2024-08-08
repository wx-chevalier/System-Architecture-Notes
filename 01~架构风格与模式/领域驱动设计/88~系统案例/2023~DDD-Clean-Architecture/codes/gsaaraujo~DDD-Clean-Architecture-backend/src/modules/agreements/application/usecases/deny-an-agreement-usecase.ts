import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';
import { ApplicationError } from '@core/domain/errors/application-error';

import {
  IDenyAnAgreementUsecase,
  DenyAnAgreementUsecaseInput,
  DenyAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/deny-an-agreement-usecase';
import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';

import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

export class DenyAnAgreementUsecase implements IDenyAnAgreementUsecase {
  public constructor(
    private readonly notifyPartyUsecase: INotifyPartyUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: DenyAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, DenyAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findOneByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    const isCreditor = input.partyId === agreement.creditorPartyId;

    const denyAgreementOrError = isCreditor
      ? agreement.creditorPartyConsent.denyAgreement()
      : agreement.debtorPartyConsent.denyAgreement();

    if (denyAgreementOrError.isLeft()) {
      const error = denyAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);

    const notifyPartyOrError = await this.notifyPartyUsecase.execute({
      title: 'Agreement denied!',
      content: `The ${
        isCreditor ? `creditor ${agreement.creditorPartyId}` : `debtor ${agreement.debtorPartyId}`
      } has denied his part of the agreement.`,
      partyId: isCreditor ? agreement.debtorPartyId : agreement.creditorPartyId,
    });

    if (notifyPartyOrError.isLeft()) {
      const error = notifyPartyOrError.value;
      return left(error);
    }

    return right(undefined);
  }
}
