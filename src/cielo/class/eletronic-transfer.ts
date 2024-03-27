import { TransactionInterface } from '../interface/transaction.interface';
import {
    EletronicTransferCreateResponseModel,
    EletronicTransferCreateRequestModel,
} from '../models/eletronic-transfer';
import { Utils } from './utils';

export class EletronicTransfer {
    private util: Utils;

    constructor(transactionParams: TransactionInterface) {
        this.util = new Utils(transactionParams);
    }

    public create(
        request: EletronicTransferCreateRequestModel
    ): Promise<EletronicTransferCreateResponseModel> {
        return this.util.postToSales<
            EletronicTransferCreateResponseModel,
            EletronicTransferCreateRequestModel
        >(request);
    }
}
