import { Usecase } from '@core/domain/helpers/usecase';

export type NotifyPartyUsecaseInput = {
  partyId: string;
  title: string;
  content: string;
};

export type NotifyPartyUsecaseOutput = void;

export interface INotifyPartyUsecase
  extends Usecase<NotifyPartyUsecaseInput, NotifyPartyUsecaseOutput> {}
