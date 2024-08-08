import { Usecase } from '@core/domain/helpers/usecase';

export type MakeAnAgreementUsecaseInput = {
  debtorPartyId: string;
  creditorPartyId: string;

  amount: number;
  isCurrency: boolean;
  description?: string;
};

export type MakeAnAgreementUsecaseOutput = void;

export interface IMakeAnAgreementUsecase
  extends Usecase<MakeAnAgreementUsecaseInput, MakeAnAgreementUsecaseOutput> {}
