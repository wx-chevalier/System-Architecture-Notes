import { PrismaClient } from '@prisma/client';

import { MockContext, Context, createMockContext } from '@core/tests/prisma/context';

import { makeNotificationORM } from '@agreements/tests/factories/notification-orm-factory';

import { Notification } from '@agreements/domain/entities/notification';
import { makeNotification } from '@agreements/domain/tests/factories/notification-factory';

import { PrismaNotificationMapper } from '@agreements/infra/repositories/prisma/mappers/prisma-notification-mapper';
import { PrismaNotificationRepository } from '@agreements/infra/repositories/prisma/prisma-notification-repository';

describe('prisma-notification-repository', () => {
  let prismaNotificationRepository: PrismaNotificationRepository;

  let context: Context;
  let mockContext: MockContext;
  let mockPrismaClient: PrismaClient;

  beforeEach(() => {
    mockContext = createMockContext();
    context = mockContext as unknown as Context;
    mockPrismaClient = context.prisma;

    prismaNotificationRepository = new PrismaNotificationRepository(mockPrismaClient);
  });

  describe('create', () => {
    it('should persist and return a notification', async () => {
      const notification = makeNotification();
      const notificationORM = makeNotificationORM();
      const date = new Date().toISOString();

      jest.spyOn(global as any, 'Date').mockReturnValueOnce(date);
      jest.spyOn(mockPrismaClient.notification, 'create').mockResolvedValueOnce(notificationORM);

      const sut = await prismaNotificationRepository.create(notification);

      expect(sut).toBeInstanceOf(Notification);
      expect(mockPrismaClient.notification.create).toBeCalledWith({
        data: PrismaNotificationMapper.toPersistence(notification),
      });
    });
  });
});
