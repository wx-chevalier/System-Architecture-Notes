import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';
import { ApplicationError } from '@core/domain/errors/application-error';

import { Agreement } from '@agreements/domain/entities/agreement';
import { OwingItem } from '@agreements/domain/value-objects/owing-item';
import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';
import {
  IMakeAnAgreementUsecase,
  MakeAnAgreementUsecaseInput,
  MakeAnAgreementUsecaseOutput,
} from '@agreements/domain/usecases/make-an-agreement-usecase';

import { IPartyRepository } from '@agreements/application/repositories/party-repository';
import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';

export class MakeAnAgreementUsecase implements IMakeAnAgreementUsecase {
  public constructor(
    private readonly notifyPartyUsecase: INotifyPartyUsecase,
    private readonly partyRepository: IPartyRepository,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: MakeAnAgreementUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, MakeAnAgreementUsecaseOutput>> {
    const [creditorExists, debtorExists] = await Promise.all([
      this.partyRepository.exists(input.creditorPartyId),
      this.partyRepository.exists(input.debtorPartyId),
    ]);

    if (!creditorExists || !debtorExists) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

    const owingItemOrError = OwingItem.create({
      amount: input.amount,
      isCurrency: input.isCurrency,
      description: input.description,
    });

    if (owingItemOrError.isLeft()) {
      const error = owingItemOrError.value;
      return left(error);
    }

    const owingItem = owingItemOrError.value;

    const agreementOrError = Agreement.create({
      owingItem,
      debtorPartyId: input.debtorPartyId,
      creditorPartyId: input.creditorPartyId,
    });

    if (agreementOrError.isLeft()) {
      const error = agreementOrError.value;
      return left(error);
    }

    const agreement = agreementOrError.value;
    await this.agreementRepository.create(agreement);

    const [notifyCreditorOrError, notifyDebtorOrError] = await Promise.all([
      this.notifyPartyUsecase.execute({
        title: 'Agreement created!',
        content: `A agreement between ${agreement.creditorPartyId} (creditor) and ${agreement.debtorPartyId} (debtor) has been created.`,
        partyId: agreement.creditorPartyId,
      }),
      this.notifyPartyUsecase.execute({
        title: 'Agreement created!',
        content: `A agreement between ${agreement.creditorPartyId} (creditor) and ${agreement.debtorPartyId} (debtor) has been created.`,
        partyId: agreement.debtorPartyId,
      }),
    ]);

    if (notifyCreditorOrError.isLeft() || notifyDebtorOrError.isLeft()) {
      const error = notifyCreditorOrError.isLeft()
        ? (notifyCreditorOrError.value as DomainError | ApplicationError)
        : (notifyDebtorOrError.value as DomainError | ApplicationError);

      return left(error);
    }

    return right(undefined);
  }
}
