import { Agreement } from '@agreements/domain/entities/agreement';

import { IAgreementRepository } from '@agreements/application/repositories/agreement-repository';

export class FakeAgreementRepository implements IAgreementRepository {
  public agreements: Agreement[] = [];

  public async exists(id: string): Promise<boolean> {
    const agreement = this.agreements.find((agreement) => agreement.id === id);
    return !!agreement;
  }

  public async create(agreement: Agreement): Promise<Agreement> {
    this.agreements.push(agreement);
    return agreement;
  }

  public async findOneById(id: string): Promise<Agreement | null> {
    const agreement = this.agreements.find((agreement) => agreement.id === id);

    if (!agreement) return null;
    return agreement;
  }

  public async findAllByPartyId(partyId: string): Promise<Agreement[]> {
    const agreements = this.agreements.filter(
      (agreement) => agreement.creditorPartyId === partyId || agreement.debtorPartyId === partyId,
    );

    return agreements;
  }

  public async findOneByIdAndPartyId(id: string, partyId: string): Promise<Agreement | null> {
    const agreement = this.agreements.find(
      (agreement) =>
        agreement.id === id &&
        (agreement.creditorPartyId === partyId || agreement.debtorPartyId === partyId),
    );

    if (!agreement) return null;
    return agreement;
  }

  public async update(updatedAgreement: Agreement): Promise<Agreement> {
    const agreementIndex = this.agreements.findIndex(
      (agreement) => agreement.id === updatedAgreement.id,
    );

    this.agreements[agreementIndex] = updatedAgreement;
    return updatedAgreement;
  }

  public async delete(id: string): Promise<void> {
    const agreementIndex = this.agreements.findIndex((agreement) => agreement.id === id);
    this.agreements.splice(agreementIndex, 1);
  }
}
