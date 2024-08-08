import { AgreementProfile as AgreementProfileORM } from '@prisma/client';

type MakeAgreementProfileORMProps = Partial<AgreementProfileORM>;

export const makeAgreementProfileORM = (
  props?: MakeAgreementProfileORMProps,
): AgreementProfileORM => {
  return {
    id: '4756e453-5c5a-4f2a-8385-1104704f7045',
    debtorProfileId: '09006bc3-ac16-4bad-b050-7ff46b9ecbfb',
    creditorProfileId: '2bd71260-342b-4cd1-8e45-4e40a62ab920',
    agreementId: '4c7b5abd-b969-461b-93ee-50494df9995a',
    ...props,
  };
};
