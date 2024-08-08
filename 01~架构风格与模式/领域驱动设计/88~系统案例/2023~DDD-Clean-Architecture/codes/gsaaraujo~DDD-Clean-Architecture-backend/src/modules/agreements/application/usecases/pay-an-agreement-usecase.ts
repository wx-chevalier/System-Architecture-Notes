import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';
import { ApplicationError } from '@core/domain/errors/application-error';

import {
  IPayAnAgreementUsecase,
  PayAnAgreementUsecaseInput,
  PayAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/pay-an-agreement-usecase';
import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';

import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

export class PayAnAgreementUsecase implements IPayAnAgreementUsecase {
  public constructor(
    private readonly notifyPartyUsecase: INotifyPartyUsecase,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: PayAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, PayAnAgreementUsecaseOutput>> {
    const agreement = await this.agreementRepository.findOneByIdAndPartyId(
      input.agreementId,
      input.partyId,
    );

    if (!agreement) {
      const error = new AgreementNotFoundError('Agreement was not found');
      return left(error);
    }

    const isCreditor = input.partyId === agreement.creditorPartyId;

    const payAgreementOrError = isCreditor
      ? agreement.creditorPartyConsent.payAgreement()
      : agreement.debtorPartyConsent.payAgreement();

    if (payAgreementOrError.isLeft()) {
      const error = payAgreementOrError.value;
      return left(error);
    }

    await this.agreementRepository.update(agreement);

    const notifyPartyOrError = await this.notifyPartyUsecase.execute({
      title: 'Agreement paid!',
      content: `The ${
        isCreditor ? `creditor ${agreement.creditorPartyId}` : `debtor ${agreement.debtorPartyId}`
      } has paid his part of the agreement.`,
      partyId: isCreditor ? agreement.debtorPartyId : agreement.creditorPartyId,
    });

    if (notifyPartyOrError.isLeft()) {
      const error = notifyPartyOrError.value;
      return left(error);
    }

    return right(undefined);
  }
}
