import { TokenizeResponseModel } from '../models/card/tokenize.response.model';
import { TokenizeRequestModel } from '../models/card/tokenize.request.model';
import { TransactionInterface } from '../interface/transaction.interface';
import { Utils } from './utils';

export class Card {
    private util: Utils;

    constructor(transactionParams: TransactionInterface) {
        this.util = new Utils(transactionParams);
    }

    public createTokenizedCard(
        request: TokenizeRequestModel
    ): Promise<TokenizeResponseModel> {
        return this.util.post<TokenizeResponseModel, TokenizeRequestModel>(
            { path: '/1/card' },
            request
        );
    }
}
