import { UserDeviceToken as UserDeviceTokenORM } from '@prisma/client';

type MakeUserDeviceTokenORMProps = Partial<UserDeviceTokenORM>;

export const makeUserDeviceTokenORM = (props?: MakeUserDeviceTokenORMProps): UserDeviceTokenORM => {
  return {
    id: 'c6f4c908-2542-4c5a-8731-b327f3d4c314',
    token: ' 8I3KF905PLFKGYSOP4O4K4BFs',
    userId: 'fe2bdc7e-88a6-4510-a61b-bd6921a5bf44',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    ...props,
  };
};
