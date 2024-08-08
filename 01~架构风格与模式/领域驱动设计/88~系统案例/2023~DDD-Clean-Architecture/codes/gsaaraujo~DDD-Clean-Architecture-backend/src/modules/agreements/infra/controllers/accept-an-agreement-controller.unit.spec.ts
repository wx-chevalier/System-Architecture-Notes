import { mock } from 'jest-mock-extended';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { MockDomainError } from '@core/tests/mocks/mock-domain-error';
import { MockUnexpectedError } from '@core/tests/mocks/mock-unexpected-error';

import { left, right } from '@core/domain/helpers/either';

import { IAcceptAnAgreementUsecase } from '@agreements/domain/usecases/accept-an-agreement-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

import { AcceptAnAgreementController } from '@agreements/infra/controllers/accept-an-agreement-controller';

describe('accept-an-agreement-controller', () => {
  let acceptAnAgreementController: AcceptAnAgreementController;
  let mockAcceptAnAgreementUsecase: IAcceptAnAgreementUsecase;

  beforeEach(() => {
    mockAcceptAnAgreementUsecase = mock<IAcceptAnAgreementUsecase>();
    acceptAnAgreementController = new AcceptAnAgreementController(mockAcceptAnAgreementUsecase);
  });

  it('should return void', async () => {
    jest.spyOn(mockAcceptAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await acceptAnAgreementController.handle(
      '4b63ae4c-d847-47de-97e1-60020184949e',
      '7afb0bdb-a969-4785-bd6d-fad81e360733',
    );

    expect(sut).toBeUndefined();
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it("should return BadRequestException if the provided 'partyId' is not UUID", () => {
    const sut = () =>
      acceptAnAgreementController.handle('123', '7afb0bdb-a969-4785-bd6d-fad81e360733');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'agreementId' is not UUID", () => {
    const sut = () =>
      acceptAnAgreementController.handle('4b63ae4c-d847-47de-97e1-60020184949e', '123');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it('should return ConflictException if acceptAnAgreementUsecase return any DomainError', () => {
    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockDomainError()));

    const sut = () =>
      acceptAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(ConflictException);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if acceptAnAgreementUsecase returns PartyNotFoundError', () => {
    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = () =>
      acceptAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if acceptAnAgreementUsecase return AgreementNotFoundError', () => {
    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = () =>
      acceptAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return InternalServerErrorException if acceptAnAgreementUsecase return an unexpected error', () => {
    jest
      .spyOn(mockAcceptAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockUnexpectedError()));

    const sut = () =>
      acceptAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(InternalServerErrorException);
    expect(mockAcceptAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });
});
