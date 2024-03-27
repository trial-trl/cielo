import { TransactionInterface } from '../interface/transaction.interface';
import {
    DebitCardSimpleTransactionResponseModel,
    DebitCardSimpleTransactionRequestModel,
} from '../models/debit-card';
import { Utils } from './utils';

export class DebitCard {
    private util: Utils;

    constructor(transactionParams: TransactionInterface) {
        this.util = new Utils(transactionParams);
    }

    public createSimpleTransaction(
        transaction: DebitCardSimpleTransactionRequestModel
    ): Promise<DebitCardSimpleTransactionResponseModel> {
        return this.util.postToSales<
            DebitCardSimpleTransactionResponseModel,
            DebitCardSimpleTransactionRequestModel
        >(transaction);
    }
}
