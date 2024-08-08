import Joi from 'joi';
import {
  Param,
  Inject,
  Delete,
  Controller,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { IRemoveAnAgreementUsecase } from '@agreements/domain/usecases/remove-an-agreement-usecase';

@Controller('agreements')
export class RemoveAnAgreementController {
  public constructor(
    @Inject('IRemoveAnAgreementUsecase')
    private readonly removeAnAgreementUsecase: IRemoveAnAgreementUsecase,
  ) {}

  @Delete('remove-an-agreement/:partyId/:agreementId')
  async handle(@Param('partyId') partyId: string, @Param('agreementId') agreementId: string) {
    const schema = Joi.object({
      partyId: Joi.string().uuid(),
      agreementId: Joi.string().uuid(),
    });

    const { error: validationError } = schema.validate({ partyId, agreementId });
    if (validationError) throw new BadRequestException(validationError.message);

    const removeAnAgreementOrError = await this.removeAnAgreementUsecase.execute({
      partyId,
      agreementId,
    });

    if (removeAnAgreementOrError.isRight()) return;
    const error = removeAnAgreementOrError.value;

    if (error.type === 'DomainError') throw new ConflictException(error.message);

    if (error.type === 'ApplicationError') {
      switch (error.name) {
        case 'AgreementNotFoundError':
          throw new NotFoundException(error.message);

        case 'CannotRemoveAgreementError':
          throw new ConflictException(error.message);
      }
    }

    throw new InternalServerErrorException('Internal server error');
  }
}
