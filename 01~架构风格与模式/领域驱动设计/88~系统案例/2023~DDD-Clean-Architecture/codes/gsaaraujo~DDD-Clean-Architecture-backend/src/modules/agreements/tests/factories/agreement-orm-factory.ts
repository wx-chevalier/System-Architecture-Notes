import { Agreement as AgreementORM, PartyStatus as PartyStatusORM } from '@prisma/client';

type MakeAgreementORMProps = Partial<AgreementORM>;

export const makeAgreementORM = (props?: MakeAgreementORMProps): AgreementORM => {
  return {
    id: '46dc0186-4a57-4f0b-ac79-db33e3ddb058',
    amount: 2,
    isCurrency: false,
    description: null,
    madeAt: new Date('2023-01-01'),
    creditorStatus: PartyStatusORM.PENDING,
    debtorStatus: PartyStatusORM.PENDING,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    ...props,
  };
};
