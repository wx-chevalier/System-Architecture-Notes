import { mock } from 'jest-mock-extended';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { left, right } from '@core/domain/helpers/either';

import { MockDomainError } from '@core/tests/mocks/mock-domain-error';
import { MockUnexpectedError } from '@core/tests/mocks/mock-unexpected-error';

import { IMakeAnAgreementUsecase } from '@agreements/domain/usecases/make-an-agreement-usecase';

import { DebtorPartyNotFoundError } from '@agreements/application/errors/debtor-party-not-found-error';
import { CreditorPartyNotFoundError } from '@agreements/application/errors/creditor-party-not-found-error';

import { MakeAnAgreementController } from '@agreements/infra/controllers/make-an-agreement-controller';

describe('make-an-agreement-controller.spec', () => {
  let makeAnAgreementController: MakeAnAgreementController;
  let mockMakeAnAgreementUsecase: IMakeAnAgreementUsecase;

  beforeEach(() => {
    mockMakeAnAgreementUsecase = mock<IMakeAnAgreementUsecase>();
    makeAnAgreementController = new MakeAnAgreementController(mockMakeAnAgreementUsecase);
  });

  it('should return void', async () => {
    jest.spyOn(mockMakeAnAgreementUsecase, 'execute').mockResolvedValueOnce(right(undefined));

    const sut = await makeAnAgreementController.handle({
      amount: 2,
      isCurrency: true,
      description: 'any_description',
      debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
      creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
    });

    expect(sut).toBeUndefined();
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      description: 'any_description',
      debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
      creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
    });
  });

  it("should return BadRequestException if the provided 'isCurrency' is not a boolean", async () => {
    const sut = () =>
      makeAnAgreementController.handle({
        amount: 2,
        isCurrency: '' as any,
        description: 'any_description',
        debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
        creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
      });

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'amount' is not a number", async () => {
    const sut = () =>
      makeAnAgreementController.handle({
        amount: '' as any,
        isCurrency: true,
        description: 'any_description',
        debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
        creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
      });

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'debtorPartyId' is not UUID", async () => {
    const sut = () =>
      makeAnAgreementController.handle({
        amount: 2,
        isCurrency: true,
        description: 'any_description',
        debtorPartyId: 'abc',
        creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
      });

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'creditorPartyId' is not UUID", async () => {
    const sut = () =>
      makeAnAgreementController.handle({
        amount: 2,
        isCurrency: true,
        description: 'any_description',
        debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
        creditorPartyId: 'abc',
      });

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it("should return BadRequestException if the provided 'description' is a empty string", async () => {
    const sut = () =>
      makeAnAgreementController.handle({
        amount: 2,
        isCurrency: true,
        description: '',
        debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
        creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
      });

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it('should return ConflictException if makeAnAgreementUsecase returns a DomainError', async () => {
    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockDomainError()));

    const sut = () =>
      makeAnAgreementController.handle({
        amount: 2,
        isCurrency: true,
        debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
        creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
      });

    expect(sut).rejects.toThrow(ConflictException);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
      creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
    });
  });

  it('should return NotFoundException if makeAnAgreementUsecase returns a CreditorPartyNotFoundError', async () => {
    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new CreditorPartyNotFoundError('')));

    const sut = () =>
      makeAnAgreementController.handle({
        amount: 2,
        isCurrency: true,
        debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
        creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
      });

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
      creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
    });
  });

  it('should return NotFoundException if makeAnAgreementUsecase returns a DebtorPartyNotFoundExceptionError', async () => {
    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new DebtorPartyNotFoundError('')));

    const sut = () =>
      makeAnAgreementController.handle({
        amount: 2,
        isCurrency: true,
        debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
        creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
      });

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
      creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
    });
  });

  it('should return InternalServerErrorException if denyAnAgreementUsecase return an unexpected error', () => {
    jest
      .spyOn(mockMakeAnAgreementUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockUnexpectedError()));

    const sut = () =>
      makeAnAgreementController.handle({
        amount: 2,
        isCurrency: true,
        debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
        creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
      });

    expect(sut).rejects.toThrow(InternalServerErrorException);
    expect(mockMakeAnAgreementUsecase.execute).toBeCalledWith({
      amount: 2,
      isCurrency: true,
      debtorPartyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
      creditorPartyId: '25bc4403-06ff-4812-b8fa-3196e133e15c',
    });
  });
});
