export type AgreementVM = {
  id: string;
  debtorPartyId: string;
  creditorPartyId: string;
  createdAt: Date;
  owingItem: {
    amount: number;
    isCurrency: boolean;
    description?: string;
  };
  debtorPartyConsent: {
    status: string;
  };
  creditorPartyConsent: {
    status: string;
  };
};
