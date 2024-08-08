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

import { IPayAnAgreementUsecase } from '@agreements/domain/usecases/pay-an-agreement-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

import { PayAnAgreementController } from '@agreements/infra/controllers/pay-an-agreement-controller';

describe('pay-an-agreement-controller', () => {
  let payAnAgreementController: PayAnAgreementController;
  let mockPayAnAgreementUsecase: IPayAnAgreementUsecase;

  beforeEach(() => {
    mockPayAnAgreementUsecase = mock<IPayAnAgreementUsecase>();
    payAnAgreementController = new PayAnAgreementController(mockPayAnAgreementUsecase);
  });

  it('should return void', async () => {
    jest.spyOn(mockPayAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await payAnAgreementController.handle(
      '4b63ae4c-d847-47de-97e1-60020184949e',
      '7afb0bdb-a969-4785-bd6d-fad81e360733',
    );

    expect(sut).toBeUndefined();
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it("should return BadRequestException if the provided 'partyId' is not UUID", () => {
    const sut = () =>
      payAnAgreementController.handle('123', '7afb0bdb-a969-4785-bd6d-fad81e360733');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'agreementId' is not UUID", () => {
    const sut = () =>
      payAnAgreementController.handle('4b63ae4c-d847-47de-97e1-60020184949e', '123');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it('should return ConflictException if payAnAgreementUsecase return any DomainError', () => {
    jest
      .spyOn(mockPayAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockDomainError()));

    const sut = () =>
      payAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(ConflictException);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if payAnAgreementUsecase returns PartyNotFoundError', () => {
    jest
      .spyOn(mockPayAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = () =>
      payAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if payAnAgreementUsecase return AgreementNotFoundError', () => {
    jest
      .spyOn(mockPayAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = () =>
      payAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return InternalServerErrorException if payAnAgreementUsecase return an unexpected error', () => {
    jest
      .spyOn(mockPayAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockUnexpectedError()));

    const sut = () =>
      payAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(InternalServerErrorException);
    expect(mockPayAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });
});
