import { TransactionInterface } from '../interface/transaction.interface';
import {
    BankSlipCreateRequestModel,
    BankSlipCreateResponseModel,
} from '../models/bank-slip';
import { Utils } from './utils';

export class BankSlip {
    private util: Utils;

    constructor(transactionParams: TransactionInterface) {
        this.util = new Utils(transactionParams);
    }

    public create(
        request: BankSlipCreateRequestModel
    ): Promise<BankSlipCreateResponseModel> {
        return this.util.postToSales<
            BankSlipCreateResponseModel,
            BankSlipCreateRequestModel
        >(request);
    }
}
