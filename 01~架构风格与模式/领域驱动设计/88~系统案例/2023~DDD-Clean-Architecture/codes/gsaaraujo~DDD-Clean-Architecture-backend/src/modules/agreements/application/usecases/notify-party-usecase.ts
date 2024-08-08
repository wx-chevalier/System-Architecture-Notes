import { DomainError } from '@core/domain/errors/domain-error';
import { Either, left, right } from '@core/domain/helpers/either';
import { ApplicationError } from '@core/domain/errors/application-error';

import {
  INotifyPartyUsecase,
  NotifyPartyUsecaseInput,
} from '@agreements/domain/usecases/notify-party-usecase';
import { Notification } from '@agreements/domain/entities/notification';

import { IPartyRepository } from '@agreements/application/repositories/party-repository';
import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { INotificationService } from '@agreements/application/services/notification-service';
import { INotificationRepository } from '@agreements/application/repositories/notification-repository';

export class NotifyPartyUsecase implements INotifyPartyUsecase {
  public constructor(
    private readonly partyRepository: IPartyRepository,
    private readonly notificationRepository: INotificationRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(
    input: NotifyPartyUsecaseInput,
  ): Promise<Either<DomainError | ApplicationError, void>> {
    const partyExists = await this.partyRepository.exists(input.partyId);

    if (!partyExists) {
      const error = new PartyNotFoundError('Party was not found');
      return left(error);
    }

    const notificationOrError = Notification.create({
      recipientPartyId: input.partyId,
      title: input.title,
      content: input.content,
    });

    if (notificationOrError.isLeft()) {
      const error = notificationOrError.value;
      return left(error);
    }

    const notification = notificationOrError.value;

    await this.notificationRepository.create(notification);

    this.notificationService.send({
      recipientPartyId: input.partyId,
      title: input.title,
      content: input.content,
    });

    return right(undefined);
  }
}
