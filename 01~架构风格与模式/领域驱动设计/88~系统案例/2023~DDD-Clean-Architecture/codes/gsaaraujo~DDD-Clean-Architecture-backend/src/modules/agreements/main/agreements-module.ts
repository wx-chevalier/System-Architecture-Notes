import admin from 'firebase-admin';
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { INotifyPartyUsecase } from '@agreements/domain/usecases/notify-party-usecase';
import { NotifyPartyUsecase } from '@agreements/application/usecases/notify-party-usecase';
import { GetAgreementsUsecase } from '@agreements/application/usecases/get-agreements-usecase';
import { PayAnAgreementUsecase } from '@agreements/application/usecases/pay-an-agreement-usecase';
import { MakeAnAgreementUsecase } from '@agreements/application/usecases/make-an-agreement-usecase';
import { DenyAnAgreementUsecase } from '@agreements/application/usecases/deny-an-agreement-usecase';
import { AcceptAnAgreementUsecase } from '@agreements/application/usecases/accept-an-agreement-usecase';
import { CancelAnAgreementUsecase } from '@agreements/application/usecases/cancel-an-agreement-usecase';
import { RemoveAnAgreementUsecase } from '@agreements/application/usecases/remove-an-agreement-usecase';

import { IPartyRepository } from '@agreements/application/repositories/party-repository';
import { INotificationService } from '@agreements/application/services/notification-service';
import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';
import { INotificationRepository } from '@agreements/application/repositories/notification-repository';

import { GetAgreementsController } from '@agreements/infra/controllers/get-agreements-controller';
import { PayAnAgreementController } from '@agreements/infra/controllers/pay-an-agreement-controller';
import { PrismaPartyRepository } from '@agreements/infra/repositories/prisma/prisma-party-repository';
import { MakeAnAgreementController } from '@agreements/infra/controllers/make-an-agreement-controller';
import { DenyAnAgreementController } from '@agreements/infra/controllers/deny-an-agreement-controller';
import { AcceptAnAgreementController } from '@agreements/infra/controllers/accept-an-agreement-controller';
import { CancelAnAgreementController } from '@agreements/infra/controllers/cancel-an-agreement-controller';
import { RemoveAnAgreementController } from '@agreements/infra/controllers/remove-an-agreement-controller';
import { PrismaAgreementRepository } from '@agreements/infra/repositories/prisma/prisma-agreement-repository';
import { FirebaseNotificationService } from '@agreements/infra/services/firebase/firebase-notification-service';
import { PrismaNotificationRepository } from '@agreements/infra/repositories/prisma/prisma-notification-repository';

@Module({
  controllers: [
    GetAgreementsController,
    PayAnAgreementController,
    DenyAnAgreementController,
    MakeAnAgreementController,
    AcceptAnAgreementController,
    CancelAnAgreementController,
    RemoveAnAgreementController,
  ],
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
    {
      provide: admin.initializeApp,
      useValue: admin.initializeApp(),
    },
    {
      provide: PrismaAgreementRepository,
      inject: [PrismaClient],
      useFactory: (prismaClient: PrismaClient) => new PrismaAgreementRepository(prismaClient),
    },
    {
      provide: PrismaNotificationRepository,
      inject: [PrismaClient],
      useFactory: (prismaClient: PrismaClient) => new PrismaNotificationRepository(prismaClient),
    },
    {
      provide: PrismaPartyRepository,
      inject: [PrismaClient],
      useFactory: (prismaClient: PrismaClient) => new PrismaPartyRepository(prismaClient),
    },
    {
      provide: FirebaseNotificationService,
      inject: [admin.initializeApp, PrismaPartyRepository],
      useFactory: (firebaseApp: admin.app.App, partyRepository: IPartyRepository) =>
        new FirebaseNotificationService(firebaseApp, partyRepository),
    },
    {
      provide: NotifyPartyUsecase,
      inject: [PrismaPartyRepository, PrismaNotificationRepository, FirebaseNotificationService],
      useFactory: (
        partyRepository: IPartyRepository,
        notificationRepository: INotificationRepository,
        notificationService: INotificationService,
      ) => new NotifyPartyUsecase(partyRepository, notificationRepository, notificationService),
    },
    {
      provide: 'IGetAgreementsUsecase',
      inject: [PrismaPartyRepository, PrismaAgreementRepository],
      useFactory: (partyRepository: IPartyRepository, agreementRepository: IAgreementRepository) =>
        new GetAgreementsUsecase(partyRepository, agreementRepository),
    },
    {
      provide: 'IAcceptAnAgreementUsecase',
      inject: [NotifyPartyUsecase, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        agreementRepository: IAgreementRepository,
      ) => new AcceptAnAgreementUsecase(notifyPartyUsecase, agreementRepository),
    },
    {
      provide: 'ICancelAnAgreementUsecase',
      inject: [NotifyPartyUsecase, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        agreementRepository: IAgreementRepository,
      ) => new CancelAnAgreementUsecase(notifyPartyUsecase, agreementRepository),
    },
    {
      provide: 'IDenyAnAgreementUsecase',
      inject: [NotifyPartyUsecase, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        agreementRepository: IAgreementRepository,
      ) => new DenyAnAgreementUsecase(notifyPartyUsecase, agreementRepository),
    },
    {
      provide: 'IPayAnAgreementUsecase',
      inject: [NotifyPartyUsecase, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        agreementRepository: IAgreementRepository,
      ) => new PayAnAgreementUsecase(notifyPartyUsecase, agreementRepository),
    },
    {
      provide: 'IRemoveAnAgreementUsecase',
      inject: [PrismaAgreementRepository],
      useFactory: (agreementRepository: IAgreementRepository) =>
        new RemoveAnAgreementUsecase(agreementRepository),
    },
    {
      provide: 'IMakeAnAgreementUsecase',
      inject: [NotifyPartyUsecase, PrismaPartyRepository, PrismaAgreementRepository],
      useFactory: (
        notifyPartyUsecase: INotifyPartyUsecase,
        partyRepository: IPartyRepository,
        agreementRepository: IAgreementRepository,
      ) => new MakeAnAgreementUsecase(notifyPartyUsecase, partyRepository, agreementRepository),
    },
  ],
})
export class AgreementsModule {}
