import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AgreementsModule } from '@agreements/main/agreements-module';

import { makeUserORM } from '@agreements/tests/factories/user-orm-factory';
import { makeProfileORM } from '@agreements/tests/factories/profile-orm-factory';

describe('make-an-agreement', () => {
  const prismaClient = new PrismaClient();
  let nestApplication: INestApplication;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AgreementsModule],
    }).compile();

    nestApplication = testingModule.createNestApplication();
    await nestApplication.init();
  });

  beforeAll(async () => {
    const debtorUserORM = makeUserORM({
      id: '9399bb27-9a23-4e1e-9665-e20022bc65cc',
      email: 'edward.elric@gmail.com',
    });

    const creditorUserORM = makeUserORM({
      id: 'dea504e7-c565-4946-b702-95344cf27825',
      email: 'alphonse.elric@gmail.com',
    });

    const debtorProfileORM = makeProfileORM({
      id: 'e672d4dd-c1e9-476d-8fcc-88b94a0762d7',
      userId: debtorUserORM.id,
    });

    const creditorProfileORM = makeProfileORM({
      id: 'e3248c4c-dd0c-4f20-98b4-68bd1ec8b799',
      userId: creditorUserORM.id,
    });

    await prismaClient.$transaction([
      prismaClient.user.createMany({
        data: [debtorUserORM, creditorUserORM],
      }),
      prismaClient.profile.createMany({
        data: [debtorProfileORM, creditorProfileORM],
      }),
    ]);
  });

  afterAll(async () => {
    await prismaClient.$transaction([
      prismaClient.user.deleteMany(),
      prismaClient.profile.deleteMany(),
      prismaClient.agreement.deleteMany(),
      prismaClient.agreementProfile.deleteMany(),
    ]);
    await prismaClient.$disconnect();
    await nestApplication.close();
  });

  it('should make an agreement', async () => {
    const sut = await request(nestApplication.getHttpServer())
      .post(`/agreements/make-an-agreement`)
      .send({
        amount: 2,
        isCurrency: false,
        description: 'any_description',
        debtorPartyId: 'e672d4dd-c1e9-476d-8fcc-88b94a0762d7',
        creditorPartyId: 'e3248c4c-dd0c-4f20-98b4-68bd1ec8b799',
      });

    expect(sut.statusCode).toBe(201);
  });
});
