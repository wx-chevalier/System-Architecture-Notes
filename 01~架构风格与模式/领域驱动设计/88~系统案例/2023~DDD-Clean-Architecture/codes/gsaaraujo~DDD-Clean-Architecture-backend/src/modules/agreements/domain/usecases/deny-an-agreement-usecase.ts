import { Usecase } from '@core/domain/helpers/usecase';

export type DenyAnAgreementUsecaseInput = {
  partyId: string;
  agreementId: string;
};

export type DenyAnAgreementUsecaseOutput = void;

export interface IDenyAnAgreementUsecase
  extends Usecase<DenyAnAgreementUsecaseInput, DenyAnAgreementUsecaseOutput> {}
