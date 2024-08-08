import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';
import { ApplicationError } from '@core/domain/errors/application-error';

import {
  ICancelAnAgreementUsecase,
  CancelAnAgreementUsecaseInput,
  CancelAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/cancel-an-agreement-usecase';
import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';

import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

export class CancelAnAgreementUsecase implements ICancelAnAgreementUsecase {
  public constructor(
    private readonly notifyPartyUsecase: INotifyPartyUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: CancelAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, CancelAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findOneByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    const isCreditor = input.partyId === agreement.creditorPartyId;

    const cancelAgreementOrError = isCreditor
      ? agreement.creditorPartyConsent.cancelAgreement()
      : agreement.debtorPartyConsent.cancelAgreement();

    if (cancelAgreementOrError.isLeft()) {
      const error = cancelAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);

    const notifyPartyOrError = await this.notifyPartyUsecase.execute({
      title: 'Agreement canceled!',
      content: `The ${
        isCreditor ? `creditor ${agreement.creditorPartyId}` : `debtor ${agreement.debtorPartyId}`
      } has canceled his part of the agreement.`,
      partyId: isCreditor ? agreement.debtorPartyId : agreement.creditorPartyId,
    });

    if (notifyPartyOrError.isLeft()) {
      const error = notifyPartyOrError.value;
      return left(error);
    }

    return right(undefined);
  }
}
