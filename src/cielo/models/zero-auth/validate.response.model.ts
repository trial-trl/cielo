export type ZeroAuthValidateResponseModel =
    | {
          Valid: boolean;
          ReturnCode: '00' | '57';
          ReturnMessage: string;
          IssuerTransactionId: string;
      }
    | {
          Code: 57 | 389;
          Message: string;
      };
