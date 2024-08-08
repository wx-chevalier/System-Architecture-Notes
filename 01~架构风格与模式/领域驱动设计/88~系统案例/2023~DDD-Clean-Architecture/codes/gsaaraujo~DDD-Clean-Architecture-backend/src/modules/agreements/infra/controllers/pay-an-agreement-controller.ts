import Joi from 'joi';
import {
  Param,
  Patch,
  Inject,
  Controller,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { IPayAnAgreementUsecase } from '@agreements/domain/usecases/pay-an-agreement-usecase';

@Controller('agreements')
export class PayAnAgreementController {
  public constructor(
    @Inject('IPayAnAgreementUsecase')
    private readonly payAnAgreementUsecase: IPayAnAgreementUsecase,
  ) {}

  @Patch('pay-an-agreement/:partyId/:agreementId')
  async handle(@Param('partyId') partyId: string, @Param('agreementId') agreementId: string) {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate({ partyId, agreementId });
    if (validationError) throw new BadRequestException(validationError.message);

    const payAnAgreementOrError = await this.payAnAgreementUsecase.execute({
      partyId,
      agreementId,
    });

    if (payAnAgreementOrError.isRight()) return;
    const error = payAnAgreementOrError.value;

    if (error.type === 'DomainError') throw new ConflictException(error.message);

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'PartyNotFoundError':
          throw new NotFoundException(error.message);

        case 'AgreementNotFoundError':
          throw new NotFoundException(error.message);
      }
    }

    throw new InternalServerErrorException('Internal server error');
  }
}
