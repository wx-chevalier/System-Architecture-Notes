import { mock } from 'jest-mock-extended';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { makeAgreement } from '@agreements/domain/tests/factories/agreement-factory';
import { MockUnexpectedError } from '@core/tests/mocks/mock-unexpected-error';

import { left, right } from '@core/domain/helpers/either';

import { IGetAgreementsUsecase } from '@agreements/domain/usecases/get-agreements-usecase';

import { PartyNotFoundError } from '@agreements/application/errors/party-not-found-error';

import { GetAgreementsController } from '@agreements/infra/controllers/get-agreements-controller';

describe('get-agreements-controller', () => {
  let getAgreementsController: GetAgreementsController;
  let mockGetAgreementsUsecase: IGetAgreementsUsecase;

  beforeEach(() => {
    mockGetAgreementsUsecase = mock<IGetAgreementsUsecase>();
    getAgreementsController = new GetAgreementsController(mockGetAgreementsUsecase);
  });

  it('should return a list of agreements', async () => {
    const agreement = makeAgreement();

    jest.spyOn(mockGetAgreementsUsecase, 'execute').mockResolvedValueOnce(right([agreement]));

    const sut = await getAgreementsController.handle('12ce2be8-2d8c-4268-b242-58563e7226c6');

    expect(sut).toHaveLength(1);
    expect(mockGetAgreementsUsecase.execute).toBeCalledWith({
      partyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
    });
  });

  it("should return BadRequestException if the provided 'partyId' is not UUID", async () => {
    const sut = () => getAgreementsController.handle('abc');

    expect(sut).rejects.toThrow(BadRequestException);
  });

  it('should return NotFoundException if getAgreementsUsecase returns PartyNotFoundError', async () => {
    jest
      .spyOn(mockGetAgreementsUsecase, 'execute')
      .mockResolvedValueOnce(left(new PartyNotFoundError('')));

    const sut = () => getAgreementsController.handle('12ce2be8-2d8c-4268-b242-58563e7226c6');

    expect(sut).rejects.toThrow(NotFoundException);
    expect(mockGetAgreementsUsecase.execute).toBeCalledWith({
      partyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
    });
  });

  it('should return InternalServerErrorException if denyAnAgreementUsecase return an unexpected error', () => {
    jest
      .spyOn(mockGetAgreementsUsecase, 'execute')
      .mockResolvedValueOnce(left(new MockUnexpectedError()));

    const sut = () => getAgreementsController.handle('12ce2be8-2d8c-4268-b242-58563e7226c6');

    expect(sut).rejects.toThrow(InternalServerErrorException);
    expect(mockGetAgreementsUsecase.execute).toBeCalledWith({
      partyId: '12ce2be8-2d8c-4268-b242-58563e7226c6',
    });
  });
});
