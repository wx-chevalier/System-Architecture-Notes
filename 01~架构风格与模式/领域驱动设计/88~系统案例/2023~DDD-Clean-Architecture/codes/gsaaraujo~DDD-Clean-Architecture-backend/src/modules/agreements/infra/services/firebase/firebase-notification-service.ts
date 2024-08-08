import { app } from 'firebase-admin';
import { Message } from 'firebase-admin/lib/messaging/messaging-api';

import {
  NotificationDTO,
  INotificationService,
} from '@agreements/application/services/notification-service';
import { IPartyRepository } from '@agreements/application/repositories/party-repository';

export class FirebaseNotificationService implements INotificationService {
  public constructor(
    private readonly firebaseApp: app.App,
    private readonly partyRepository: IPartyRepository,
  ) {}

  async send(notificationDTO: NotificationDTO): Promise<void> {
    const registrationTokenOrNull = await this.partyRepository.findOneRegistrationTokenByPartyId(
      notificationDTO.recipientPartyId,
    );

    if (registrationTokenOrNull === null) return;
    const registrationToken = registrationTokenOrNull;

    const message: Message = {
      token: registrationToken,
      data: { title: notificationDTO.title, content: notificationDTO.content },
    };

    this.firebaseApp.messaging().send(message);
  }
}
