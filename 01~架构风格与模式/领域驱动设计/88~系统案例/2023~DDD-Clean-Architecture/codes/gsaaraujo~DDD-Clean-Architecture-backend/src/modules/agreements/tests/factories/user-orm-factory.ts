import { User as UserORM } from '@prisma/client';

type MakeUserORMProps = Partial<UserORM>;

export const makeUserORM = (props?: MakeUserORMProps): UserORM => {
  return {
    id: 'e5f34463-00cd-4193-9cae-08b9733ee313',
    email: 'edward.elric@gmail.com',
    password: '123456789',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    ...props,
  };
};
