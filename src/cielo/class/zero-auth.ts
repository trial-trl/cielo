import { Utils } from './utils';
import { TransactionInterface } from '../interface/transaction.interface';
import { ZeroAuthValidateResponseModel } from '../models/zero-auth/validate.response.model';
import { CreditCardModel, TokenizedCreditCardModel } from '../models';
import { ZeroAuthValidateEWalletRequestModel } from '../models/zero-auth/validate-ewallet.request.model';

export class ZeroAuth {
    private util: Utils;

    constructor(transactionParams: TransactionInterface) {
        this.util = new Utils(transactionParams);
    }

    public validateCard(
        request: CreditCardModel
    ): Promise<ZeroAuthValidateResponseModel> {
        return this.util.post<
            ZeroAuthValidateResponseModel,
            CreditCardModel
        >({ path: '/1/zeroauth' }, request);
    }

    public validateTokenizedCard(
        request: TokenizedCreditCardModel
    ): Promise<ZeroAuthValidateResponseModel> {
        return this.util.post<
            ZeroAuthValidateResponseModel,
            TokenizedCreditCardModel
        >({ path: '/1/zeroauth' }, request);
    }

    public validateEWallet(
        request: ZeroAuthValidateEWalletRequestModel
    ): Promise<ZeroAuthValidateResponseModel> {
        return this.util.post<
            ZeroAuthValidateResponseModel,
            ZeroAuthValidateEWalletRequestModel
        >({ path: '/2/zeroauth' }, request);
    }
}
