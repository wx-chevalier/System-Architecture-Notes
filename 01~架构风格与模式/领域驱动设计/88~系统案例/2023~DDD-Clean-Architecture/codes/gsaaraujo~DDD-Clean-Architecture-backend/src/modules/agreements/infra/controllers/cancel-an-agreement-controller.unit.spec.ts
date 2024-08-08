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

import { ICancelAnAgreementUsecase } from '@agreements/domain/usecases/cancel-an-agreement-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

import { CancelAnAgreementController } from '@agreements/infra/controllers/cancel-an-agreement-controller';

describe('cancel-an-agreement-controller', () => {
  let cancelAnAgreementController: CancelAnAgreementController;
  let mockCancelAnAgreementUsecase: ICancelAnAgreementUsecase;

  beforeEach(() => {
    mockCancelAnAgreementUsecase = mock<ICancelAnAgreementUsecase>();
    cancelAnAgreementController = new CancelAnAgreementController(mockCancelAnAgreementUsecase);
  });

  it('should return void', async () => {
    jest.spyOn(mockCancelAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await cancelAnAgreementController.handle(
      '4b63ae4c-d847-47de-97e1-60020184949e',
      '7afb0bdb-a969-4785-bd6d-fad81e360733',
    );

    expect(sut).toBeUndefined();
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it("should return BadRequestException if the provided 'partyId' is not UUID", () => {
    const sut = () =>
      cancelAnAgreementController.handle('123', '7afb0bdb-a969-4785-bd6d-fad81e360733');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'agreementId' is not UUID", () => {
    const sut = () =>
      cancelAnAgreementController.handle('4b63ae4c-d847-47de-97e1-60020184949e', '123');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it('should return ConflictException if cancelAnAgreementUsecase return any DomainError', () => {
    jest
      .spyOn(mockCancelAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockDomainError()));

    const sut = () =>
      cancelAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(ConflictException);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if cancelAnAgreementUsecase returns PartyNotFoundError', () => {
    jest
      .spyOn(mockCancelAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = () =>
      cancelAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if cancelAnAgreementUsecase return AgreementNotFoundError', () => {
    jest
      .spyOn(mockCancelAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = () =>
      cancelAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return InternalServerErrorException if cancelAnAgreementUsecase return an unexpected error', () => {
    jest
      .spyOn(mockCancelAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockUnexpectedError()));

    const sut = () =>
      cancelAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(InternalServerErrorException);
    expect(mockCancelAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });
});
