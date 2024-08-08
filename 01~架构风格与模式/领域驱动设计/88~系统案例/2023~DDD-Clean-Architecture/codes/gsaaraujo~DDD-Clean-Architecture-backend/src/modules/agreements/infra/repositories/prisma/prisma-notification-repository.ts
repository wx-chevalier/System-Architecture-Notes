import { PrismaClient } from '@prisma/client';

import { Notification } from '@agreements/domain/entities/notification';

import { INotificationRepository } from '@agreements/application/repositories/notification-repository';

import { PrismaNotificationMapper } from '@agreements/infra/repositories/prisma/mappers/prisma-notification-mapper';

export class PrismaNotificationRepository implements INotificationRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  async create(notification: Notification): Promise<Notification> {
    const newNotification = await this.prismaClient.notification.create({
      data: PrismaNotificationMapper.toPersistence(notification),
    });

    return PrismaNotificationMapper.toDomain(newNotification);
  }
}
