import Joi from 'joi';
import {
  Param,
  Patch,
  Controller,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';

import { IAcceptAnAgreementUsecase } from '@agreements/domain/usecases/accept-an-agreement-usecase';

@Controller('agreements')
export class AcceptAnAgreementController {
  public constructor(
    @Inject('IAcceptAnAgreementUsecase')
    private readonly acceptAnAgreementUsecase: IAcceptAnAgreementUsecase,
  ) {}

  @Patch('accept-an-agreement/:partyId/:agreementId')
  async handle(@Param('partyId') partyId: string, @Param('agreementId') agreementId: string) {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate({ partyId, agreementId });
    if (validationError) throw new BadRequestException(validationError.message);

    const acceptAnAgreementOrError = await this.acceptAnAgreementUsecase.execute({
      partyId,
      agreementId,
    });

    if (acceptAnAgreementOrError.isRight()) return;
    const error = acceptAnAgreementOrError.value;

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
