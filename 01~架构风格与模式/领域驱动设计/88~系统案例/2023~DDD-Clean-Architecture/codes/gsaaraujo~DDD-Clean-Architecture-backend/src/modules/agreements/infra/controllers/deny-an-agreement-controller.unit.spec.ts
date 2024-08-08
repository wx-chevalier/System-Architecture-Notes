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

import { IDenyAnAgreementUsecase } from '@agreements/domain/usecases/deny-an-agreement-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';
import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';

import { DenyAnAgreementController } from '@agreements/infra/controllers/deny-an-agreement-controller';

describe('deny-an-agreement-controller', () => {
  let denyAnAgreementController: DenyAnAgreementController;
  let mockDenyAnAgreementUsecase: IDenyAnAgreementUsecase;

  beforeEach(() => {
    mockDenyAnAgreementUsecase = mock<IDenyAnAgreementUsecase>();
    denyAnAgreementController = new DenyAnAgreementController(mockDenyAnAgreementUsecase);
  });

  it('should return void', async () => {
    jest.spyOn(mockDenyAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await denyAnAgreementController.handle(
      '4b63ae4c-d847-47de-97e1-60020184949e',
      '7afb0bdb-a969-4785-bd6d-fad81e360733',
    );

    expect(sut).toBeUndefined();
    expect(mockDenyAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it("should return BadRequestException if the provided 'partyId' is not UUID", () => {
    const sut = () =>
      denyAnAgreementController.handle('123', '7afb0bdb-a969-4785-bd6d-fad81e360733');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'agreementId' is not UUID", () => {
    const sut = () =>
      denyAnAgreementController.handle('4b63ae4c-d847-47de-97e1-60020184949e', '123');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it('should return ConflictException if denyAnAgreementUsecase return any DomainError', () => {
    jest
      .spyOn(mockDenyAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockDomainError()));

    const sut = () =>
      denyAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(ConflictException);
    expect(mockDenyAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if denyAnAgreementUsecase returns PartyNotFoundError', () => {
    jest
      .spyOn(mockDenyAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = () =>
      denyAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockDenyAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if denyAnAgreementUsecase return AgreementNotFoundError', () => {
    jest
      .spyOn(mockDenyAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = () =>
      denyAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockDenyAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return InternalServerErrorException if denyAnAgreementUsecase return an unexpected error', () => {
    jest
      .spyOn(mockDenyAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockUnexpectedError()));

    const sut = () =>
      denyAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(InternalServerErrorException);
    expect(mockDenyAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });
});
