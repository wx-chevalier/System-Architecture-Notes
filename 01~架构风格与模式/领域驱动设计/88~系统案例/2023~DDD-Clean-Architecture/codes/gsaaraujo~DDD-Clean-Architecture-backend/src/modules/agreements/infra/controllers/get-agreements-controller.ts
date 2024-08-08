import Joi from 'joi';
import {
  Get,
  Param,
  Inject,
  Controller,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { IGetAgreementsUsecase } from '@agreements/domain/usecases/get-agreements-usecase';

import { AgreementVM } from '@agreements/infra/view-models/agreement-vm';

@Controller('agreements')
export class GetAgreementsController {
  public constructor(
    @Inject('IGetAgreementsUsecase')
    private readonly getAgreementsUsecase: IGetAgreementsUsecase,
  ) {}

  @Get('get-agreements/:partyId')
  async handle(@Param('partyId') partyId: string): Promise<AgreementVM[]> {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate({ partyId });
    if (validationError) throw new BadRequestException(validationError.message);

    const agreementsOrError = await this.getAgreementsUsecase.execute({
      partyId,
    });

    if (agreementsOrError.isRight()) {
      const agreements = agreementsOrError.value;
      return agreements.map((agreement) => ({
        id: agreement.id,
        debtorPartyId: agreement.debtorPartyId,
        creditorPartyId: agreement.creditorPartyId,
        createdAt: agreement.createdAt,
        owingItem: {
          amount: agreement.owingItem.amount,
          isCurrency: agreement.owingItem.isCurrency,
          description: agreement.owingItem.description,
        },
        debtorPartyConsent: {
          status: agreement.debtorPartyConsent.status,
        },
        creditorPartyConsent: {
          status: agreement.debtorPartyConsent.status,
        },
      }));
    }

    const error = agreementsOrError.value;

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'PartyNotFoundError':
          throw new NotFoundException(error.message);
      }
    }

    throw new InternalServerErrorException('Internal server error');
  }
}
