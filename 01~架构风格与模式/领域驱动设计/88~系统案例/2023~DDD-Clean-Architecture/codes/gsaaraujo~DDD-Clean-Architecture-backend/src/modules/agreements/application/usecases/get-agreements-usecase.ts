import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';
import { ApplicationError } from '@core/domain/errors/application-error';

import {
  IGetAgreementsUsecase,
  GetAgreementsUsecaseInput,
  GetAgreementsUsecaseOutput,
} from '@agreements/domain/usecases/get-agreements-usecase';

import { IPartyRepository } from '@agreements/application/repositories/party-repository';
import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';

export class GetAgreementsUsecase implements IGetAgreementsUsecase {
  public constructor(
    private readonly partyRepository: IPartyRepository,
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(
    input: GetAgreementsUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, GetAgreementsUsecaseOutput[]>> {
    const partyExists = await this.partyRepository.exists(input.partyId);

    if (!partyExists) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

    const agreement = await this.agreementRepository.findAllByPartyId(input.partyId);

    return right(agreement);
  }
}
