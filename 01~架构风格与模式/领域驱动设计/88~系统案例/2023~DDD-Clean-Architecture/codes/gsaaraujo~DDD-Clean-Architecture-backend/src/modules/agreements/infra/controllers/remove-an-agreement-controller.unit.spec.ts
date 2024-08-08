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

import { IRemoveAnAgreementUsecase } from '@agreements/domain/usecases/remove-an-agreement-usecase';

import { AgreementNotFoundError } from '@agreements/application/errors/agreement-not-found-error';
import { CannotRemoveAgreementError } from '@agreements/application/errors/cannot-remove-agreement-error';

import { RemoveAnAgreementController } from '@agreements/infra/controllers/remove-an-agreement-controller';

describe('remove-an-agreement-controller', () => {
  let removeAnAgreementController: RemoveAnAgreementController;
  let mockRemoveAnAgreementUsecase: IRemoveAnAgreementUsecase;

  beforeEach(() => {
    mockRemoveAnAgreementUsecase = mock<IRemoveAnAgreementUsecase>();
    removeAnAgreementController = new RemoveAnAgreementController(mockRemoveAnAgreementUsecase);
  });

  it('should return void', async () => {
    jest.spyOn(mockRemoveAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await removeAnAgreementController.handle(
      '4b63ae4c-d847-47de-97e1-60020184949e',
      '7afb0bdb-a969-4785-bd6d-fad81e360733',
    );

    expect(sut).toBeUndefined();
    expect(mockRemoveAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it("should return BadRequestException if the provided 'partyId' is not UUID", () => {
    const sut = () =>
      removeAnAgreementController.handle('123', '7afb0bdb-a969-4785-bd6d-fad81e360733');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'agreementId' is not UUID", () => {
    const sut = () =>
      removeAnAgreementController.handle('4b63ae4c-d847-47de-97e1-60020184949e', '123');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it('should return ConflictException if removeAnAgreementUsecase return any DomainError', () => {
    jest
      .spyOn(mockRemoveAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockDomainError()));

    const sut = () =>
      removeAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(ConflictException);
    expect(mockRemoveAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return NotFoundException if removeAnAgreementUsecase returns AgreementNotFoundError', () => {
    jest
      .spyOn(mockRemoveAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new AgreementNotFoundError('')));

    const sut = () =>
      removeAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockRemoveAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return ConflictException if removeAnAgreementUsecase return CannotRemoveAgreementError', () => {
    jest
      .spyOn(mockRemoveAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CannotRemoveAgreementError('')));

    const sut = () =>
      removeAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(ConflictException);
    expect(mockRemoveAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });

  it('should return InternalServerErrorException if removeAnAgreementUsecase return an unexpected error', () => {
    jest
      .spyOn(mockRemoveAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockUnexpectedError()));

    const sut = () =>
      removeAnAgreementController.handle(
        '4b63ae4c-d847-47de-97e1-60020184949e',
        '7afb0bdb-a969-4785-bd6d-fad81e360733',
      );

    expect(sut).rejects.toThrow(InternalServerErrorException);
    expect(mockRemoveAnAgreementUsecase.execute).toBeCalledWith({
      partyId: '4b63ae4c-d847-47de-97e1-60020184949e',
      agreementId: '7afb0bdb-a969-4785-bd6d-fad81e360733',
    });
  });
});
