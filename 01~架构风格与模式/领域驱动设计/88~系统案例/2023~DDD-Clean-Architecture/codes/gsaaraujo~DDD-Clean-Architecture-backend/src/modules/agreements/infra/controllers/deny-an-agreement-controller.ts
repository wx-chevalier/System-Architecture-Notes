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

import { IDenyAnAgreementUsecase } from '@agreements/domain/usecases/deny-an-agreement-usecase';

@Controller('agreements')
export class DenyAnAgreementController {
  public constructor(
    @Inject('IDenyAnAgreementUsecase')
    private readonly denyAnAgreementUsecase: IDenyAnAgreementUsecase,
  ) {}

  @Patch('deny-an-agreement/:partyId/:agreementId')
  async handle(@Param('partyId') partyId: string, @Param('agreementId') agreementId: string) {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate({ partyId, agreementId });
    if (validationError) throw new BadRequestException(validationError.message);

    const denyAnAgreementOrError = await this.denyAnAgreementUsecase.execute({
      partyId,
      agreementId,
    });

    if (denyAnAgreementOrError.isRight()) return;
    const error = denyAnAgreementOrError.value;

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
