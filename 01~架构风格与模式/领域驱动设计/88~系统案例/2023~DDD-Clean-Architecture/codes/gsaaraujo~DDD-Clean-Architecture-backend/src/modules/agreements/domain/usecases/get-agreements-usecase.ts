import { Usecase } from '@core/domain/helpers/usecase';

import { Agreement } from '@agreements/domain/entities/agreement';

export type GetAgreementsUsecaseInput = {
  partyId: string;
};

export type GetAgreementsUsecaseOutput = Agreement;

export interface IGetAgreementsUsecase
  extends Usecase<GetAgreementsUsecaseInput, GetAgreementsUsecaseOutput[]> {}
