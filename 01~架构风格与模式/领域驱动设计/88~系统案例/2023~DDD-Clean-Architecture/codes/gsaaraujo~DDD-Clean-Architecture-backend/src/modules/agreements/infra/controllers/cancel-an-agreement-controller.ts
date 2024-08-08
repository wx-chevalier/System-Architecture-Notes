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

import { ICancelAnAgreementUsecase } from '@agreements/domain/usecases/cancel-an-agreement-usecase';

@Controller('agreements')
export class CancelAnAgreementController {
  public constructor(
    @Inject('ICancelAnAgreementUsecase')
    private readonly cancelAnAgreementUsecase: ICancelAnAgreementUsecase,
  ) {}

  @Patch('cancel-an-agreement/:partyId/:agreementId')
  async handle(@Param('partyId') partyId: string, @Param('agreementId') agreementId: string) {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate({ partyId, agreementId });
    if (validationError) throw new BadRequestException(validationError.message);

    const cancelAnAgreementOrError = await this.cancelAnAgreementUsecase.execute({
      partyId,
      agreementId,
    });

    if (cancelAnAgreementOrError.isRight()) return;
    const error = cancelAnAgreementOrError.value;

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
