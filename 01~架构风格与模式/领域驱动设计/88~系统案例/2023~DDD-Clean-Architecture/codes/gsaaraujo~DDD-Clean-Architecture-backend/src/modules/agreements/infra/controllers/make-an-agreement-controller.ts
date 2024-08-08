import Joi from 'joi';
import {
  Post,
  Body,
  Inject,
  Controller,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { IMakeAnAgreementUsecase } from '@agreements/domain/usecases/make-an-agreement-usecase';

export type MakeAnAgreementControllerInput = {
  amount: number;
  isCurrency: boolean;
  description?: string;
  debtorPartyId: string;
  creditorPartyId: string;
};

@Controller('agreements')
export class MakeAnAgreementController {
  public constructor(
    @Inject('IMakeAnAgreementUsecase')
    private readonly makeAnAgreementUsecase: IMakeAnAgreementUsecase,
  ) {}

  @Post('make-an-agreement')
  async handle(@Body() input: MakeAnAgreementControllerInput) {
    const schema = Joi.object({
      isCurrency: Joi.boolean(),
      amount: Joi.number().max(255),
      debtorPartyId: Joi.string().uuid(),
      creditorPartyId: Joi.string().uuid(),
      description: Joi.string().optional().max(255),
    });

    const { error: validationError } = schema.validate(input);

    if (validationError) throw new BadRequestException(validationError.message);

    const makeAnAgreementOrError = await this.makeAnAgreementUsecase.execute({
      amount: input.amount,
      isCurrency: input.isCurrency,
      description: input.description,
      debtorPartyId: input.debtorPartyId,
      creditorPartyId: input.creditorPartyId,
    });

    if (makeAnAgreementOrError.isRight()) return;
    const error = makeAnAgreementOrError.value;

    if (error.type === 'DomainError') {
      throw new ConflictException(error.message);
    }

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'CreditorPartyNotFoundError':
          throw new NotFoundException(error.message);

        case 'DebtorPartyNotFoundError':
          throw new NotFoundException(error.message);
      }
    }

    throw new InternalServerErrorException('Internal server error');
  }
}
